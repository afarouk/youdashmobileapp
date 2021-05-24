import React from 'react';
import PropTypes from 'prop-types';
import { Card } from '../Shared/Card/Card';

export const PickUp = ({ order, userName }) => {
  const { orderId, pricePaid, message, cyclicOrderIdInt } = order || {};
  return (
    <Card className="order-status__pickup">
      <p className="font-size-md">
        Order for <strong>Pickup</strong>
      </p>
      <h1 className="font-size-xl">Order #{cyclicOrderIdInt}</h1>
      <p className="font-size-md">System Id {orderId}</p>
      <p className="flex font-size-md">
        <span>Name</span>
        <span>{userName}</span>
      </p>
      {message && pricePaid && (
        <p className="flex font-size-md">
          <span>Payment</span>
          <span>
            {message} ${pricePaid ? Math.abs(pricePaid).toFixed(2) : ''}
          </span>
        </p>
      )}
    </Card>
  );
};

PickUp.propTypes = {
  order: PropTypes.object,
  userName: PropTypes.string
};
