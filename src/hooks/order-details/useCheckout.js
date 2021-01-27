import { useEffect, useState } from 'react';
import { paymentAPI } from '../../services/api';
import { useLocation, useParams } from 'react-router-dom';
const customVantivStyles = `
body {
  font-family: 'Poppins', sans-serif !important;
}
.cvv{
  width: 55px;
}
.selectOption {
  height: 28px;
  border-radius: 2px;
}
.inputText {
  border-radius: 2px;
  height: 20px;
}
.buttonEmbedded {
  background-color: #0097a7 !important;
  border: none !important;
  border-radius: 3px !important;
  padding-top: 10px !important;
  padding-bottom: 10px !important;
  font-size: 1.2em !important;
  display: block !important;
  text-align: center;
  margin-bottom: 1em;
  margin-top: 1em;
}
.buttonEmbedded:visited {
  background-color: #0097a7 !important;
  border: none !important;
  border-radius: 3px !important;
  padding-top: 10px !important;
  padding-bottom: 10px !important;
  font-size: 1.2em !important;
  display: block !important;
  text-align: center;
  margin-bottom: 1em;
  margin-top: 1em;
}
#tdCardInformation {
border:none;
color: #0097A7;
font-size:14px;
}
#tdTransactionInformationHeader {
border:none;
color: #0097A7;
font-size:14px;
}
#tdManualEntry { ;
border:none; ;
}

#tdTransactionInformationHeader {
border:none;
}

#tdTransactionInformation {
border:none;
}

#tdTransactionButtons {
border:none;
}
`;
export default (
  businessData,
  shoppingCartItems,
  priceTotal,
  handleCreateOrder,
  orderRequestError
) => {
  const { businessUrlKey } = useParams();
  const { search } = useLocation();
  const [transactionSetup, setTransactionSetup] = useState(null);
  const [transactionSetupUrl, setTransactionSetupUrl] = useState(null);
  const [transactionError, setTransactionError] = useState(false);
  const [checkoutMode, setCheckoutMode] = useState(false);

  const { serviceAccommodatorId, serviceLocationId } = businessData;
  const { acceptCreditCards, paymentProcessor } = businessData.onlineOrder;
  useEffect(() => {
    if (transactionSetupUrl) {
      const handler = (event) => {
        if (event.origin !== window.location.origin) return;

        if (event.data && event.data.message) {
          const { message } = event.data;
          // console.log(message);
          if (
            message &&
            message.indexOf('TransactionSetupID') !== -1 &&
            message.indexOf('HostedPaymentStatus') !== -1
          ) {
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

            if (hostedPaymentStatus === 'Cancelled') {
              setTransactionSetupUrl(null);
              setCheckoutMode(false);
            } else if (
              hostedPaymentStatus === 'Complete' &&
              transactionID &&
              shoppingCartItems &&
              shoppingCartItems.length &&
              transactionSetup &&
              transactionSetup.validationCode === validationCode
            ) {
              handleCreateOrder(null, {
                ...transactionSetup,
                hostedPaymentStatus,
                transactionID,
                expressResponseCode,
                expressResponseMessage,
                CVVResponseCode,
                approvalNumber,
                lastFour,
                cardLogo,
                approvedAmount,
                paymentProcessor
              });
            } else {
              setTransactionSetupUrl(null);
              setCheckoutMode(false);
              setTransactionError(true);
            }
          }
        }
      };
      window.addEventListener('message', handler);
      // clean up
      return () => window.removeEventListener('message', handler);
    }
  }, [transactionSetup, transactionSetupUrl]); // empty array => run only once

  useEffect(() => {
    if (
      checkoutMode &&
     /* !transactionSetupUrl &&*/
      acceptCreditCards &&
      paymentProcessor &&
      shoppingCartItems &&
      shoppingCartItems.length
    ) {
      // paymentAPI.transactionSetup()
      paymentAPI
        .getTransactionSetupID({
          serviceAccommodatorId,
          serviceLocationId,
          transactionAmount: priceTotal,
          demo: true,
          processTransactionTitle: 'Place Order',
          returnURL: `${window.location.origin}/${businessUrlKey}/checkout-redirect${search}`,
          customCSS: customVantivStyles
        })
        .then((response) => {
          if (response.data) {
            const { transactionSetupId, iframeSrc, orderUUID } = response.data;
            if (transactionSetupId && iframeSrc) {
              setTransactionError(false);
              setTransactionSetup(response.data);
              setTransactionSetupUrl(`${iframeSrc}?TransactionSetupID=${transactionSetupId}`);
            }
          }
        });
    }
  }, [checkoutMode]);

  useEffect(() => {
    if (orderRequestError) {
      setCheckoutMode(false);
      setTransactionSetupUrl(null);
      setTransactionSetup(null);
    }
  }, [orderRequestError]);

  return [checkoutMode, setCheckoutMode, transactionSetupUrl, transactionError];
};
