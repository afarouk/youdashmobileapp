import { useEffect, useState } from 'react';

import { paymentAPI } from '../../services/api';
import { useLocation, useParams } from 'react-router-dom';
import { CHECKOUT_MODE, PAYMENT_PROCESSOR } from '../../config/constants';

import { useHooksIframe } from './useCheckoutIframed';
import { useDispatch, useSelector } from 'react-redux';
import * as shoppingCart from '../../redux/slices/shoppingCart';

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
  // const [checkoutMode, setCheckoutMode] = useState(CHECKOUT_MODE.USER_DATA);

  const dispatch = useDispatch();
  const checkoutMode = useSelector(state => state.shoppingCart.checkoutMode);
  const setCheckoutMode = (newCheckoutMode) => {
    dispatch(shoppingCart.setCheckoutMode(newCheckoutMode));
  }

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

  if (paymentProcessor === PAYMENT_PROCESSOR.VANTIV_ECOMMERCE) {
    useHooksIframe(fwdConfig);
  }

  useEffect(() => {
    return () => setCheckoutMode(CHECKOUT_MODE.USER_DATA);
  }, [])

  return {
    checkoutMode, 
    setCheckoutMode, 
    transactionSetupUrl, 
    transactionError,
    setTransactionSetupUrl,
  };
};
