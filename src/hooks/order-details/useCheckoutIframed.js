import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';

import { paymentAPI } from '../../services/api';
import useBusinessData from '../../hooks/core/useBusinessData';
import { CHECKOUT_MODE } from '../../config/constants';

const customVantivStyles = `body {  font-family: 'Poppins', sans-serif !important; } .cvv{  width: 55px; } .selectOption {  height: 28px;  border-radius: 2px; } .inputText {  border-radius: 2px;  height: 20px; } .buttonEmbedded {  background-color: #0097a7 !important;  border: none !important;  border-radius: 3px !important;  padding-top: 10px !important;  padding-bottom: 10px !important;  font-size: 1.2em !important;  display: block !important;  text-align: center;  margin-bottom: 1em;  margin-top: 1em; } .buttonEmbedded:visited {  background-color: #0097a7 !important;  border: none !important;  border-radius: 3px !important;  padding-top: 10px !important;  padding-bottom: 10px !important;  font-size: 1.2em !important;  display: block !important;  text-align: center;  margin-bottom: 1em;  margin-top: 1em; } #tdCardInformation { border:none; color: #0097A7; font-size:14px; } #tdTransactionInformationHeader { border:none; color: #0097A7; font-size:14px; } #tdManualEntry { ; border:none; ; }  #tdTransactionInformationHeader { border:none; }  #tdTransactionInformation { border:none; }  #tdTransactionButtons { border:none; }`;

export function useHooksIframe(config, handleCreateorder) {
  const {
    checkoutMode,
    setCheckoutMode,
    transactionSetup,
    setTransactionSetup,
    transactionSetupUrl,
    setTransactionSetupUrl,
    transactionError,
    setTransactionError,
    priceTotal,
    shoppingCartItems,
    orderRequestError,
    handleCreateOrder
  } = config;

  const { businessUrlKey } = useParams();
  const { search } = useLocation();
  const [businessData, loading, error] = useBusinessData();

  const { serviceAccommodatorId, serviceLocationId } = businessData;
  const { acceptCreditCards, paymentProcessor } = businessData.onlineOrder;

  useEffect(() => {
    if (!transactionSetupUrl) {
      return;
    }

    const handler = (event = window.event) => {
      const { message } = event.data || "";

      if (event.origin !== window.location.origin) return;
      if (!event.data || !event.data.message) return;

      const messageIsOk = message.match(/TransactionSetupID/).length && message.match(/HostedPaymentStatus/).length;
      if (!messageIsOk) {
        return;
      }

      const urlParams = new URLSearchParams(message);
      const hostedPaymentStatus = urlParams.get('HostedPaymentStatus');
      const transactionID = urlParams.get('TransactionID');
      const validationCode = urlParams.get('ValidationCode');
      const expressResponseCode = urlParams.get('ExpressResponseCode');
      const expressResponseMessage = urlParams.get('ExpressResponseMessage');
      const CVVResponseCode = urlParams.get('CVVResponseCode');
      const approvalNumber = urlParams.get('ApprovalNumber');
      const lastFour = urlParams.get('LastFour');
      const cardLogo = urlParams.get('CardLogo');
      const approvedAmount = urlParams.get('ApprovedAmount');

      const paymentOk = hostedPaymentStatus === 'Complete' &&
        transactionID &&
        shoppingCartItems &&
        shoppingCartItems.length &&
        transactionSetup &&
        transactionSetup.validationCode === validationCode;

      if (!paymentOk) {
        setTransactionSetupUrl(null);
        setCheckoutMode(CHECKOUT_MODE.USER_DATA);
        setTransactionError(true);
      }

      if (hostedPaymentStatus === 'Cancelled') {
        setTransactionSetupUrl(null);
        setCheckoutMode(CHECKOUT_MODE.USER_DATA);
        return;
      }

      const transactionSetupCopy = {...transactionSetup};
      delete transactionSetupCopy['transactionSetupId'];

      const transactionData = {
        transactionSetup,
        hostedPaymentStatus,
        transactionID,
        expressResponseCode,
        expressResponseMessage,
        CVVResponseCode,
        approvalNumber,
        lastFour,
        cardLogo,
        approvedAmount,
        paymentProcessor,
      }

      handleCreateOrder({ transactionData });
    };

    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [transactionSetup, transactionSetupUrl]); // empty array => run only once

  useEffect(() => {
    async function paymentTransaction() {
      const readyToPay = checkoutMode === CHECKOUT_MODE.CARD_PAYMENT &&
        acceptCreditCards &&
        paymentProcessor &&
        shoppingCartItems &&
        shoppingCartItems.length;

      if (!readyToPay) return;

      const configTransaction = {
        serviceAccommodatorId,
        serviceLocationId,
        transactionAmount: priceTotal,
        demo: true,
        processTransactionTitle: 'Place Order',
        returnURL: `${window.location.origin}/${businessUrlKey}/checkout-redirect${search}`,
        customCSS: customVantivStyles
      };

      let data;
      try {
        const response = await paymentAPI.getTransactionSetupID(configTransaction);
        data = response.data;
      } catch (err) {
        console.error('GET_TRANSACTION_SETUP_ID_ERROR', err);
      }
      if (!data) {
        setTransactionError(true);
        setCheckoutMode(CHECKOUT_MODE.USER_DATA);
        return;
      };

      const { transactionSetupId, iframeSrc, orderUUID } = data;
      if (transactionSetupId && iframeSrc) {
        setTransactionError(false);
        setTransactionSetup(data);
        setTransactionSetupUrl(`${iframeSrc}?TransactionSetupID=${transactionSetupId}`);
      }
    }
    paymentTransaction();
  }, [checkoutMode]);

  useEffect(() => {
    if (orderRequestError) {
      setCheckoutMode(CHECKOUT_MODE.USER_DATA);
      setTransactionSetupUrl(null);
      setTransactionSetup(null);
    }
  }, [orderRequestError]);
}
