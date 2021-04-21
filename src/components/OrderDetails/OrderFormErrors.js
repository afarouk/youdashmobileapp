import React from 'react';
import { Alert } from 'antd';

function makeAlert(type = "warning", { showIcon, message, closable } = {
  showIcon: true,
  message: "unknown"
}) {
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
    alerts.push(makeAlert("error", {message: "Checkout error.", closable: true}))
  }
  if (orderRequestError) {
    alerts.push(makeAlert("error", {message: "Placing order error.", closable: true}))
  }
  if (preventOrdering) {
    alerts.push(makeAlert("warning", {message: "Business doesn't accept orders at this moment."}))
  }

  return alerts;
}
