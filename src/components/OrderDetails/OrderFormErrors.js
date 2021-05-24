import React from 'react';
import { Alert } from 'antd';
import { getPaymentTokenFieldsErrors } from '../../utils/helpers';

function AlertWrapper(props) {
  const { 
    type = 'warning',
    showIcon = true,
    message = 'unknown',
    closable,
  } = props;

  const fwdProps = {
    type,
    showIcon,
    message,
    closable
  };

  return <Alert {...fwdProps} />;
}

export default function OrderFormErrors({
  transactionError,
  orderRequestError,
  preventOrdering,
  paymentTokenError,
}) {
  let alerts = [];

  if (transactionError) {
    alerts.push(
      <AlertWrapper key="transaction" type="error" message="Checkout error." closable />
    )
  }
  if (orderRequestError) {
    const message = typeof orderRequestError === 'string' && orderRequestError.trim() !== ''
      ? orderRequestError
      : 'Placing order error.';

    const paymentTokenFieldsErrors = getPaymentTokenFieldsErrors(paymentTokenError);
    const hasPaymentTokenFieldErrors = paymentTokenFieldsErrors && paymentTokenFieldsErrors.length !== 0;

    if (!hasPaymentTokenFieldErrors) {
      alerts.push(
        <AlertWrapper key="orderRequest" type="error" message={message} closable />
      )
    } 
  }
  if (preventOrdering) {
    alerts.push(
      <AlertWrapper key="preventOrdering" type="warning" message="Business doesn't accept orders at this moment." false />
    )
  }

  return alerts;
}
