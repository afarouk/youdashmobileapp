import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams, useHistory, useLocation } from 'react-router-dom';

import { OrderDetails } from '../components/OrderDetails/OrderDetails';

import { getPercent, scrollToElement } from '../utils/helpers';
import { CHECKOUT_MODE, PAYMENT_PROCESSOR } from '../config/constants';
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

  useEffect(() => {
    if (
      acceptCreditCards 
      && checkoutMode === CHECKOUT_MODE.USER_DATA 
      && isMobileVerified
      && paymentProcessor !== PAYMENT_PROCESSOR.VANTIV_ECOMMERCE
    ) {
      proceedToNextStepForCardPayment();
    }
  }, [acceptCreditCards, checkoutMode, isMobileVerified])

  const handleEditItem = (index) =>
    history.push(`/${businessUrlKey}/shopping-cart/${index}${search}`);

  const handleDeleteCartItem = (index) => dispatch(deleteCartItem(index));

  function handlePlaceOrder(evt = window.event) {
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

  const signUpUser = async () => {
    setOrderInProgress(true);
    let userData;

    try {
      userData = await onSignUpSubmit(updateMode, user, true);
    } catch (err) {
      console.error('onSignUpSubmit ERROR', err)
      setOrderInProgress(false);
      return;
    }

    setUpdateMode(false);
    setOrderInProgress(false);

    return { userData };
  }

  const proceedToNextStepForCardPayment = () => {
    let newCheckoutMode = CHECKOUT_MODE.CARD_PAYMENT;

    if (paymentProcessor === PAYMENT_PROCESSOR.CARDCONNECT_ECOMMERCE & checkoutMode === CHECKOUT_MODE.USER_DATA) {
      newCheckoutMode = CHECKOUT_MODE.CARD_PAYMENT_PRESTEP;
    }

    setCheckoutMode(newCheckoutMode);
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

    if (acceptCreditCards) {
      if (user && !credentialsChanged) {
        await sendVerificationAnd(() => proceedToNextStepForCardPayment());
      } else {
        const { userData } = await signUpUser();
        const { adhocEntry, mobileVerified} = userData;

        if (!adhocEntry && mobileVerified) {
          proceedToNextStepForCardPayment();
        } else if (adhocEntry && !mobileVerified && verificationCode) {
          setOrderInProgress(true);
          await onSendVerificationCode();
          proceedToNextStepForCardPayment();
          setOrderInProgress(false);
        }
      }
      return 
    }

    if (acceptCash) {
      if (user && !credentialsChanged) {
        setOrderInProgress(true);
        await sendVerificationAnd(() => onCreateOrder());
      } else {
        const { userData } = await signUpUser();
        const { adhocEntry, mobileVerified} = userData;
        
        if (!adhocEntry && mobileVerified) {
          onCreateOrder({ newUser: userData });
        } else if (adhocEntry && !mobileVerified && verificationCode) {
          await onSendVerificationCode();
          onCreateOrder({ newUser: userData });
        } else {
          setOrderInProgress(false);
        }
      }

      return;
    }
    
    

    throw new Error('ACCEPT METHOD NOT KNOWN');
  };

  let showSubmitButton = true;
  if (isIframePayment && checkoutMode === CHECKOUT_MODE.CARD_PAYMENT) {
    showSubmitButton = false;
  }

  const isTsys = paymentProcessor === PAYMENT_PROCESSOR.TSYS_ECOMMERCE;
  const isHeartland = paymentProcessor === PAYMENT_PROCESSOR.HEARTLAND_ECOMMERCE;
  const isCardConnect = paymentProcessor === PAYMENT_PROCESSOR.CARDCONNECT_ECOMMERCE;
  const isNabancard = paymentProcessor === PAYMENT_PROCESSOR.NABANCARD_ECOMMERCE;
  const isCardPrestepRequired = isCardConnect;

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
      setCheckoutMode={setCheckoutMode}
      isCardPrestepRequired={isCardPrestepRequired}
      isTsys={isTsys}
      isCardConnect={isCardConnect}
      isHeartland={isHeartland}
      isNabancard={isNabancard}
    />
  );
};
OrderDetailsPage.propTypes = {
  //myProp: PropTypes.string.isRequired
};

export default OrderDetailsPage;
