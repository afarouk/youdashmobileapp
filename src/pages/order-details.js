import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams, useHistory, useLocation } from 'react-router-dom';

import { OrderDetails } from '../components/OrderDetails/OrderDetails';

import { getPercent, scrollToElement } from '../utils/helpers';
import { CHECKOUT_MODE, paymentProcessors } from '../config/constants';
import { deleteCartItem } from '../redux/slices/shoppingCart';

import useMemberData from '../hooks/user/useMemberData';
import useCreateOrder from '../hooks/order-details/useCreateOrder';
import useCheckout from '../hooks/order-details/useCheckout';
import usePreventOrdering from '../hooks/core/usePreventOrdering';
import useMobileVerification from '../hooks/user/useMobileVerification';
import useCreditcardDetails from '../hooks/payment-details/useCreditcardDetails';

const OrderDetailsPage = ({ businessData, user }) => {
  const dispatch = useDispatch();
  const { businessUrlKey } = useParams();
  const { search } = useLocation();
  const history = useHistory();

  const { acceptCreditCards, paymentProcessor, allowOrderComments, acceptCash } = businessData.onlineOrder;
  const [updateMode, setUpdateMode] = useState(false);
  const toggleUpdateMode = () => setUpdateMode(!updateMode);

  const [
    credentials,
    credentialsChanged,
    onCredentialsChange,
    onSignUpSubmit,
    registerMemberRequestError
  ] = useMemberData(businessData, user, updateMode, toggleUpdateMode);

  const [
    isMobileVerified,
    verificationCode,
    verificationCodeError,
    onVerificationCodeChange,
    onSendVerificationCode,
    onResendVerificationCode
  ] = useMobileVerification(user);

  const [
    orderInProgress,
    setOrderInProgress,
    shoppingCartItems,
    onCreateOrder,
    onResetOrderError,
    priceTotal,
    discountedPriceSubTotal,
    orderDiscount,
    tips,
    taxes,
    extraFee,
    onTipsChange,
    orderPickUp,
    priceSubTotal,
    orderRequestError,
    comment,
    onCommentChange,
    paymentTokenError,
  ] = useCreateOrder(businessData, user);

  const [
    checkoutMode, 
    setCheckoutMode,
    transactionSetupUrl, 
    transactionError,
  ] = useCheckout(
    businessData, 
    shoppingCartItems,
    priceTotal, 
    onCreateOrder,
    orderRequestError
  );

  const [
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
  ] = useCreditcardDetails({
    businessData,
    shoppingCartItems,
    priceTotal,
    onCreateOrder,
    orderRequestError,
    setOrderInProgress,
    resetOrderError: onResetOrderError,
  });

  const [preventOrdering] = usePreventOrdering(businessData);

  useEffect(() => {
    if (!shoppingCartItems || !shoppingCartItems.length) {
      history.push(`/${businessUrlKey}/${search}`);
    }
  }, []);

  const handleEditItem = (index) =>
    history.push(`/${businessUrlKey}/shopping-cart/${index}${search}`);

  const handleDeleteCartItem = (index) => dispatch(deleteCartItem(index));

  function handlePlaceOrder(evt = window.event) {
    if (evt && evt.defaultPrevented) {
      return;
    }

    if (evt && evt.preventDefault && typeof evt.preventDefault === 'function') {
      evt.preventDefault();
    }

    try {
      orderHandler()
    } catch (err) {
      console.error(err);
      setOrderInProgress(false);
    }
  }

  async function orderHandler() {
    if (!orderPickUp.date || !orderPickUp.time) {
      return scrollToElement(document.getElementById('pickup-selectors'));
    }

    if (orderRequestError) {
      onResetOrderError();
    }

    const sendVerificationAnd = async (fn) => {
      if (!isMobileVerified && verificationCode) {
        await onSendVerificationCode();
        fn();
      } else {
        fn();
      }
    }

    if (user && !credentialsChanged) {
      if (acceptCreditCards) {
        await sendVerificationAnd(() => setCheckoutMode(CHECKOUT_MODE.CARD_PAYMENT));
      } else {
        setOrderInProgress(true);
        await sendVerificationAnd(() => onCreateOrder());
      }
    } else {
      setOrderInProgress(true);
      let userData;

      try {
        userData = await onSignUpSubmit(updateMode, user, true);
      } catch (err) {
        console.error('onSignUpSubmit ERROR', err)
        setOrderInProgress(false);
        return;
      }

      const adhoc = userData.adhocEntry;
      const verified = userData.mobileVerified;
      setUpdateMode(false);
      setOrderInProgress(false);

      if (acceptCreditCards) {
        if (!adhoc && verified) {
          setCheckoutMode(CHECKOUT_MODE.CARD_PAYMENT);
        } else if (adhoc && !verified && verificationCode) {
          setOrderInProgress(true);
          await onSendVerificationCode();
          setCheckoutMode(CHECKOUT_MODE.CARD_PAYMENT);
          setOrderInProgress(false);
        }
      } else {
        if (!adhoc && verified) {
          onCreateOrder({ newUser: userData });
        } else if (adhoc && !verified && verificationCode) {
          await onSendVerificationCode();
          onCreateOrder({ newUser: userData });
        } else {
          setOrderInProgress(false);
        }
      }
    }
  };

  let showSubmitButton = true;

  console.log('isIframePayment', isIframePayment, checkoutMode)
  if (isIframePayment && checkoutMode === CHECKOUT_MODE.CARD_PAYMENT) {
    showSubmitButton = false;
  }

  return (
    <OrderDetails
      allowOrderComments={allowOrderComments}
      isMobileVerified={isMobileVerified}
      verificationCode={verificationCode}
      verificationCodeError={verificationCodeError}
      onVerificationCodeChange={onVerificationCodeChange}
      onSendVerificationCode={onSendVerificationCode}
      onResendVerificationCode={onResendVerificationCode}
      comment={comment}
      onCommentChange={onCommentChange}
      preventOrdering={preventOrdering}
      registerMemberRequestError={registerMemberRequestError}
      orderRequestError={orderRequestError}
      transactionSetupUrl={transactionSetupUrl}
      transactionError={transactionError}
      paymentTokenError={paymentTokenError}
      onTipsChange={onTipsChange}
      taxes={taxes}
      extraFee={extraFee}
      tips={tips}
      priceTotal={priceTotal}
      priceSubTotal={priceSubTotal}
      orderDiscount={orderDiscount}
      discountedPriceSubTotal={discountedPriceSubTotal}
      orderInProgress={orderInProgress}
      credentials={credentials}
      onCredentialsChange={onCredentialsChange}
      orderPickUp={orderPickUp}
      businessData={businessData}
      shoppingCartItems={shoppingCartItems}
      onEditItem={handleEditItem}
      onDeleteItem={handleDeleteCartItem}
      onCreateOrder={handlePlaceOrder}
      user={user}
      showSubmitButton={showSubmitButton}
      updateMode={updateMode}
      checkoutMode={checkoutMode}
      toggleUpdateMode={toggleUpdateMode}
      submitLabel={acceptCreditCards ? 'Checkout' : 'Place Order'}
      acceptCreditCards={acceptCreditCards}
      acceptCash={acceptCash}
      isResolved={isResolved}
      isIframePayment={isIframePayment}
      ccData={ccData}
      issuer={issuer}
      formState={formState}
      focused={focused}
      handleCallback={handleCallback}
      handleInputFocus={handleInputFocus}
      handleInputChange={handleInputChange}
      handleCardSubmit={handleCardSubmit}
    />
  );
};
OrderDetailsPage.propTypes = {
  //myProp: PropTypes.string.isRequired
};

export default OrderDetailsPage;
