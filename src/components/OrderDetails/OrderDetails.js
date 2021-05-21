import React, { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { Alert, Button } from 'antd';

import { Tips } from './Tips';
import { Pickup } from './Pickup';
import { SubTotal } from './SubTotal';
import { GrossTotal } from './GrossTotal';
import { OrderItemsList } from './OrderItemList/OrderItemsList';
import CreditcardForm from './CreditcardForm';
import OrderFormErrors from './OrderFormErrors';

import { UserDataForm } from '../Shared/UserDataForm/UserDataForm';
import { UserDetails } from '../Shared/UserDataForm/UserDetails';
import { Form } from '../Shared/Form/Form';
import { Card } from '../Shared/Card/Card';
import { CheckoutIFrame } from '../Checkout/CheckoutIFrame';
import { Comments } from '../Shared/Comments/Comments';
import { VerificationCode } from './VerificationCode/VerificationCode';

import './OrderDetails.css';

export const OrderDetails = (props) => {
  const {
    priceTotal,
    tips,
    taxes,
    extraFee,
    orderPickUp,
    shoppingCartItems,
    priceSubTotal,
    discountedPriceSubTotal,
    orderDiscount,
    businessData,
    user,
    credentials,
    updateMode,
    showSubmitButton,
    toggleUpdateMode,
    orderInProgress,
    orderRequestError,
    submitLabel,
  
    transactionSetupUrl,
    transactionError,
    registerMemberRequestError,
  
    onTipsChange,
    onEditItem,
    onDeleteItem,
    onCreateOrder,
    onCredentialsChange,
    preventOrdering,
  
    allowOrderComments,
    comment,
    onCommentChange,
  
    isMobileVerified,
    verificationCode,
    verificationCodeError,
    onVerificationCodeChange,
    onResendVerificationCode,
  
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
    checkoutMode,
    acceptCreditCards,
  } = props;
  const { saslName } = businessData;

  const submitForm = useRef(null);
  const portalForm = useRef(null);

  const onSubmitHandler = (evt = window.event) => {
    onCreateOrder(evt);
  };

  const onCardSubmitHandler = async (evt = window.event) => {
    handleCardSubmit(evt);
  };

  const clickSubmitBtn = (event) => {
    if (!isMobileVerified) {
      onCreateOrder(event);
      return;
    }

    if (!acceptCreditCards) {
      onCreateOrder(event);
      return;
    }

    if (isIframePayment) {
      onCreateOrder(event)
    } else {
      let portalFormBtn = portalForm.current.querySelector('[type=submit]');
      portalFormBtn.click();
    }
    
  };

  const ccProps = {
    isResolved,
    isIframePayment,
    ccData,
    issuer,
    focused,
    formState,
    handleCallback,
    handleInputFocus,
    handleInputChange,
    onCardSubmitHandler,
    priceTotal
  };

  const [isFormValid, setIsFormValid] = useState(false);
  useEffect(() => {
    // preventOrdering || !shoppingCartItems.length ||
    // !credentials.firstName || !credentials.email || !credentials.mobile
    const orderingEnabled = !preventOrdering;
    const hasCartItems = shoppingCartItems.length > 0;
    const dataProvided = Boolean(credentials.firstName && credentials.email && credentials.mobile);
    const valid = orderingEnabled
      && hasCartItems
      && dataProvided;
    setIsFormValid(valid);
  }, [preventOrdering, shoppingCartItems, credentials])

  // @todo formstate not updated when ccNumber/ccName/etc change
  const [isPayFormValid, setIsPayFormValid] = useState(true);
  useEffect(() => {
    if (isIframePayment) {
      return;
    }
    const fs = formState;
    const valid = (fs.valid && fs.name && fs.expiry && fs.cvc) ? true : false;
    setIsPayFormValid(valid);
  }, [isIframePayment, formState]);

  const [btnProps, setBtnProps] = useState({disabled: true});
  useEffect(() => {
    if (checkoutMode) {
      setBtnProps({ disabled : !isFormValid || !isPayFormValid });
    } else {
      setBtnProps({ disabled: !isFormValid })
    }
  }, [isFormValid, isPayFormValid]);

  const isCreditCardNotIframePayment = isResolved && isMobileVerified && acceptCreditCards && !isIframePayment && portalForm.current;

  return (
    <div className="p-default">
      <div className="order-details">
        <Pickup
          {...businessData.pickUp}
          orderPickUp={orderPickUp}
          saslName={saslName}
          user={user}
          businessData={businessData}
        />
        <Card>
          <OrderItemsList
            items={shoppingCartItems}
            onDeleteItem={onDeleteItem}
            onEditItem={onEditItem}/>

          <SubTotal
            orderDiscount={orderDiscount}
            priceSubTotal={priceSubTotal}
            discountedPriceSubTotal={discountedPriceSubTotal}
            taxes={taxes}
            tips={tips}
            extraFee={extraFee}/>

          <Tips tips={tips} onChange={onTipsChange} />

          <GrossTotal total={priceTotal} />
        </Card>

        {allowOrderComments && (
          <Card>
            <h4 className="font-size-lg primary-text">Comments</h4>
            <Comments
              onTextChange={onCommentChange}
              value={comment}
              placeholder={'Add notes for the Chief'}
            />
          </Card>
        )}

        <Form
          onSubmit={(e) => onSubmitHandler(e)}>
          {(!user || (user && updateMode)) && (
            <Card>
              <UserDataForm
                user={user}
                updateMode={updateMode}
                shouldChangeUpdateMode={true}
                onChange={onCredentialsChange}
                credentials={credentials}
              />
            </Card>
          )}

          {user && !updateMode && <UserDetails user={user} />}

          {user && !isMobileVerified && (
            <VerificationCode
              onResend={onResendVerificationCode}
              onChange={onVerificationCodeChange}
              verificationCode={verificationCode}
              verificationCodeError={verificationCodeError}
            />
          )}

          {registerMemberRequestError && (
            <Alert message={registerMemberRequestError} type="error" showIcon closable />
          )}

          { isResolved && isIframePayment && transactionSetupUrl && !orderRequestError && !transactionError && (
            <CheckoutIFrame transactionSetupUrl={transactionSetupUrl} />
          )}

          <button ref={submitForm} type="submit" className="hidden">formsubmit</button>
        </Form>

        {isCreditCardNotIframePayment && createPortal(<CreditcardForm {...ccProps} />, portalForm.current)}

        <div ref={portalForm}></div>

        { <OrderFormErrors {...{transactionError, orderRequestError, preventOrdering}} />}

        { showSubmitButton && (
          <Button
            block
            size="large"
            type="primary"
            className="font-size-md"
            onClick={clickSubmitBtn}
            loading={orderInProgress}
            {...btnProps}>
            {submitLabel}
          </Button>
        )}

      </div>
    </div>
  );
};
