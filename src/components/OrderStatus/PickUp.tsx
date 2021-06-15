import React from 'react';
import { Card } from '../Shared/Card/Card';

type PickUpProps = {
  order: any,
  userName: string,
}

export const PickUp: React.FC<PickUpProps> = ({ order, userName }) => {
  const { orderId, pricePaid, message, cyclicOrderIdInt, deliveryType, tablePath  } = order || {};

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, __, tableId] = (tablePath || '').split('#');

  return (
    <Card className="order-status__pickup">
      <div className="flex">
        <p className="font-size-md">
          Order for <strong className="order-status__pickup-delivery-type">{deliveryType?.displayText}</strong>
        </p>
        {tableId && <div className="order-status__pickup-table">Table <strong className="order-status__pickup-table-number">{tableId}</strong></div>}
      </div>
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
