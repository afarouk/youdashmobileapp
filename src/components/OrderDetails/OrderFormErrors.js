import React from 'react';
import { Alert } from 'antd';

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
  preventOrdering
}) {
  let alerts = [];

  if (transactionError) {
    alerts.push(
      <AlertWrapper key="transaction" type="error" message="Checkout error." closable />
    )
  }
  if (orderRequestError) {
    alerts.push(
      <AlertWrapper key="orderRequest" type="error" message="Placing order error." closable />
    )
  }
  if (preventOrdering) {
    alerts.push(
      <AlertWrapper key="preventOrdering" type="warning" message="Business doesn't accept orders at this moment." false />
    )
  }

  return alerts;
}
