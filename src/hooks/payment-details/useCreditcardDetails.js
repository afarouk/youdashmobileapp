import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { paymentProcessors } from '../../config/constants';
import { paymentAPI, orderAPI } from '../../services/api';

import {
  formatCreditCardNumber,
  formatCVC,
  formatExpirationDate,
  formatFormData
} from "../../utils/ccHelpers";

import {
  setIsResolved,
  setIsIframePayment,
  setccHolderName,
  setccNumber,
  setccCVC,
  setccExpiration,
  setccIssuer,
  setFocused,
  setFormState
} from '../../redux/slices/cc';

export default ({
  businessData,
  shoppingCartItems,
  priceTotal,
  onCreateOrder,
  orderRequestError,
  setOrderInProgress,
  resetOrderError,
}) => {
  const { paymentProcessor } = businessData.onlineOrder;
  const { serviceAccommodatorId, serviceLocationId } = businessData
  const dispatch = useDispatch();

  const ccData = useSelector((state) => {
    const {
      ccHolderName, ccNumber, ccExpiration, ccCVC, ccIssuer
    } = state.cc;
    return { ccHolderName, ccNumber, ccExpiration, ccCVC, ccIssuer };
  });

  const isResolved = useSelector((state) => state.cc.isResolved)
  const isIframePayment = useSelector((state) => state.cc.isIframePayment)
  const issuer = useSelector((state) => state.cc.ccIssuer);
  const focused = useSelector((state) => state.cc.focused);
  const formState = useSelector((state) => state.cc.formState);

  useEffect(() => {
    if (!paymentProcessor) return;

    // only when vantiv, it is externally managed
    let isIframePayment = paymentProcessor === paymentProcessors.VANTIV_ECOMMERCE;

    dispatch(setIsResolved(true))
    dispatch(setIsIframePayment(isIframePayment))
  }, [paymentProcessor]);


  const handleCallback = ({ issuer }, isValid) => {
    if (isValid) {
      dispatch(setccIssuer(issuer));
    }
    dispatch(setFormState({ name: 'valid', value: isValid }));
  };

  const handleInputFocus = ({ target }) => {
    dispatch(setFocused(target.name));
  };

  const handleInputChange = ({ target }) => {
    let { name, value } = target;
    let action;

    if (name === "number") {
      target.value = formatCreditCardNumber(value);
      action = setccNumber(value);
    } else if (name === "expiry") {
      target.value = formatExpirationDate(value);
      action = setccExpiration(value);
    } else if (name === "cvc") {
      target.value = formatCVC(value);
      action = setccCVC(value);
    } else if (name === "name") {
      action = setccHolderName(value);
    }

    dispatch(action);
    dispatch(setFormState({name, value}));
  };

  const formToObject = (form) => {
    return [...form.elements]
    .filter(d => d.name)
    .reduce((acc, d) => {
      acc[d.name] = d.value;
      return acc;
    }, {});
  }

  const handleCardSubmit = async (evt) => {
    if (evt && evt.preventDefault) {
      evt.preventDefault();
    }

    resetOrderError();
    setOrderInProgress(true);
    await processCardOrder();
    setOrderInProgress(false);
  };

  const processCardOrder = async () => {
    let creditCardData;

    try {
      const { token, created, expires } = await paymentAPI.getPaymentToken()
        creditCardData = {
          token,
          created,
          expires,
          paymentProcessor
        };
    } catch (err) {
      console.error('TOKEN_ERROR', err);
    }

    if (!creditCardData) {
      return;
    }

    let nextOrderData;
    try {
      const nextOrderIdResponse = await orderAPI.getNextOrderId({
        serviceAccommodatorId,
        serviceLocationId,
      })
      nextOrderData = nextOrderIdResponse.data;
    } catch (err) {
      console.error('GET_NEXT_ORDER_DATA_ERROR', err);
    }

    if (!nextOrderData) {
      return;
    }

    try {
      await onCreateOrder({ creditCardData, nextOrderData })
    } catch (err) {
      console.error('CREATE_ORDER_ERROR', err);
    }
  }

  return [
    isResolved, 
    isIframePayment,
    ccData, 
    issuer, 
    formState, 
    focused,
    handleCallback,
    handleInputFocus,
    handleInputChange,
    handleCardSubmit,
  ];
}

