import React, { useEffect, useState } from 'react';
import { OrderDetails } from '../components/OrderDetails/OrderDetails';
import { useDispatch } from 'react-redux';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import { deleteCartItem } from '../redux/slices/shoppingCart';

import { getPercent, scrollToElement } from '../utils/helpers';
import useMemberData from '../hooks/user/useMemberData';

import useCreateOrder from '../hooks/order-details/useCreateOrder';
import { paymentProcessors } from '../config/constants';

import useCheckout from '../hooks/order-details/useCheckout';
import usePreventOrdering from '../hooks/core/usePreventOrdering';

import useMobileVerification from '../hooks/user/useMobileVerification';

const OrderDetailsPage = ({ businessData, user }) => {
  const dispatch = useDispatch();
  const { businessUrlKey } = useParams();
  const { search } = useLocation();
  const history = useHistory();

  const { acceptCreditCards, paymentProcessor, allowOrderComments } = businessData.onlineOrder;
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
    onCommentChange
  ] = useCreateOrder(businessData, user);

  const [checkoutMode, setCheckoutMode, transactionSetupUrl, transactionError] = useCheckout(
    businessData,
    shoppingCartItems,
    priceTotal,
    onCreateOrder,
    orderRequestError
  );

  const [preventOrdering] = usePreventOrdering(businessData);

  useEffect(() => {
    if (!shoppingCartItems || !shoppingCartItems.length) {
      history.push(`/${businessUrlKey}/${search}`);
    }
  }, []);
  const handleEditItem = (index) =>
    history.push(`/${businessUrlKey}/shopping-cart/${index}${search}`);

  const handleDeleteCartItem = (index) => dispatch(deleteCartItem(index));
  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (!orderPickUp.day || !orderPickUp.time) {
      return scrollToElement(document.getElementById('pickup-selectors'));
    }
    if (user && !credentialsChanged) {
      if (acceptCreditCards && paymentProcessor === paymentProcessors.VANTIV_HID) {
        !isMobileVerified && verificationCode
          ? onSendVerificationCode()
              .then(() => {
                setCheckoutMode(true);
              })
              .catch((error) => {
                if (error) {
                  setOrderInProgress(false);
                }
              })
          : setCheckoutMode(true);

        if (orderRequestError) {
          onResetOrderError();
        }
      } else {
        setOrderInProgress(true);
        !isMobileVerified && verificationCode
          ? onSendVerificationCode()
              .then(() => {
                onCreateOrder();
              })
              .catch((error) => {
                if (error) {
                  setOrderInProgress(false);
                }
              })
          : onCreateOrder();
      }
    } else {
      setOrderInProgress(true);
      onSignUpSubmit(updateMode, user, true)
        .then((user) => {
          setUpdateMode(false);
          setOrderInProgress(false);
          if (acceptCreditCards && paymentProcessor === paymentProcessors.VANTIV_HID) {
            if (!user.adhocEntry && user.mobileVerified) {
              setCheckoutMode(true);
            } else if (user.adhocEntry && !user.mobileVerified && verificationCode) {
              setOrderInProgress(true);
              onSendVerificationCode().then(() => {
                setCheckoutMode(true);
                setOrderInProgress(false);
              });
            }
          } else {
            if (!user.adhocEntry && user.mobileVerified) {
              onCreateOrder(user && user ? user : null);
            } else if (user.adhocEntry && !user.mobileVerified && verificationCode) {
              onSendVerificationCode().then(() => {
                onCreateOrder(user && user ? user : null);
              });
            } else {
              setOrderInProgress(false);
            }
          }
        })
        .catch((error) => {
          console.log(error);
          if (error) {
            setOrderInProgress(false);
          }
        });
    }
  };

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
      showSubmitButton={!(acceptCreditCards && checkoutMode)}
      updateMode={updateMode}
      checkoutMode={checkoutMode}
      toggleUpdateMode={toggleUpdateMode}
      submitLabel={acceptCreditCards ? 'Checkout' : 'Place Order'}
    />
  );
};
OrderDetailsPage.propTypes = {
  //myProp: PropTypes.string.isRequired
};

export default OrderDetailsPage;
