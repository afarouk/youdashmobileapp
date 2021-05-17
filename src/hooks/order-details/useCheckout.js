import { useEffect, useState } from 'react';

import { paymentAPI } from '../../services/api';
import { useLocation, useParams } from 'react-router-dom';
import { paymentProcessors } from '../../config/constants';

import { useHooksIframe } from './useCheckoutIframed';

export default (
  businessData,
  shoppingCartItems,
  priceTotal,
  handleCreateOrder,
  orderRequestError
) => {
  const [transactionSetup, setTransactionSetup] = useState(null);
  const [transactionSetupUrl, setTransactionSetupUrl] = useState(null);
  const [transactionError, setTransactionError] = useState(false);
  const [checkoutMode, setCheckoutMode] = useState(false);

  const { serviceAccommodatorId, serviceLocationId } = businessData;
  const { acceptCreditCards, paymentProcessor } = businessData.onlineOrder;

  const fwdConfig = {
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
  };

  if (paymentProcessor === paymentProcessors.VANTIV_ECOMMERCE) {
    useHooksIframe(fwdConfig);
  }


  return [checkoutMode, setCheckoutMode, transactionSetupUrl, transactionError];
};
