import React from 'react';
import { Spin } from 'antd';
import {CheckCircleIcon} from "../Shared/Icons/Icons";

export const CheckoutSuccess = () => (
  <div className="success-payment">
    <div className="success-payment__result">
      <div>
        <CheckCircleIcon />
      </div>
      <h3>Payment Completed Successfully!</h3>
    </div>
    <h3 className="primary-text success-payment__processing-order">
      <Spin size="small" /> <span>Processing Your Order</span>
    </h3>
  </div>
);
