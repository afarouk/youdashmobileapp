import React, { useRef } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';

import { Pickup } from './Pickup';
import { SubTotal } from './SubTotal';
import { GrossTotal } from './GrossTotal';
import { OrderItemsList } from './OrderItemList/OrderItemsList';
import './OrderDetails.css';
import { Tips } from './Tips';
import { Alert, Button } from 'antd';
import { UserDataForm } from '../Shared/UserDataForm/UserDataForm';
import { UserDetails } from '../Shared/UserDataForm/UserDetails';
import { Form } from '../Shared/Form/Form';
import { Card } from '../Shared/Card/Card';
import { CheckoutIFrame } from '../Checkout/CheckoutIFrame';
import CreditcardForm from './CreditcardForm';

import { Comments } from '../Shared/Comments/Comments';
import { VerificationCode } from './VerificationCode/VerificationCode';

export const OrderDetails = ({
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
}) => {
  const { saslName } = businessData;

  const submitForm = useRef(null);
  const portalForm = useRef(null);

  const onSubmitHandler = (evt = window.event) => {
    console.log('Hooked to Onsubmit');
    onCreateOrder(evt);
  };

  const onCardSubmitHandler = async (evt = window.event) => {
    const res = await handleCardSubmit(evt);
  };

  const clickSubmitBtn = () => {
    let portalFormBtn = portalForm.current.querySelector('[type=submit]');
    portalFormBtn.click();
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
  };

  // preventOrdering || !shoppingCartItems.length || !credentials.firstName || !credentials.email || !credentials.mobile

  const cond_1 = preventOrdering;
  const cond_2 = shoppingCartItems.length;
  const cond_3 = credentials.firstName && credentials.email && credentials.mobile;

  let btnProps = {
    disabled: cond_1 || !cond_2 || !cond_3
  };

  if (!isIframePayment) {
    let fs = formState;
    let isFormValid = fs.valid && fs.name && fs.expiry && fs.cvc
    btnProps.disabled = btnProps.disabled || !isFormValid;
  }

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
                toggleUpdateMode={toggleUpdateMode}
                updateMode={updateMode}
                shouldChangeUpdateMode={true}
                onChange={onCredentialsChange}
                credentials={credentials}
              />
            </Card>
          )}

          {user && !updateMode && <UserDetails user={user} toggleUpdateMode={toggleUpdateMode} />}

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

          { isResolved && !isIframePayment && portalForm.current &&
            createPortal(<CreditcardForm {...ccProps} />, portalForm.current)
          }

          {transactionError && <Alert message="Checkout error." type="error" showIcon closable />}

          {orderRequestError && <Alert message="Placing order error." type="error" showIcon closable />}

          {preventOrdering && (
            <Alert
              message="Business doesn't accept orders at this moment."
              type="warning"
              showIcon
            />
          )}

          <button ref={submitForm} type="submit" className="hidden">formsubmit</button>
        </Form>

        <div ref={portalForm}></div>

        {showSubmitButton && (
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

OrderDetails.propTypes = {
  allowOrderComments: PropTypes.bool,
  pickUp: PropTypes.object,
  products: PropTypes.array,
  onDeleteItem: PropTypes.func.isRequired,
  priceSubTotal: PropTypes.number,
  onCreateOrder: PropTypes.func.isRequired
};
