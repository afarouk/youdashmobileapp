import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { paymentProcessors } from '../../config/constants';
import { paymentAPI } from '../../services/api';

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

export default (
  businessData,
  shoppingCartItems,
  priceTotal,
  handleCreateOrder,
  orderRequestError
) => {
  const { paymentProcessor } = businessData.onlineOrder;
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

  const handleCardSubmit = (evt) => {
    if (evt && evt.preventDefault) {
      evt.preventDefault();
    }
    // const domFormData = formToObject(evt.target);
    // console.log(domFormData);

    paymentAPI.getPaymentToken()
    .then((res) => {
      const { token, created, expires } = res;
      const postData = {
        token,
        created,
        expires,
        paymentProcessor
      };
      handleCreateOrder(null, postData);
    })
    .catch((err) => {
      console.error(err);
    })
  };

  return [
    isResolved, isIframePayment,
    ccData, issuer, formState, focused,
    handleCallback,
    handleInputFocus,
    handleInputChange,
    handleCardSubmit,
  ];
}
