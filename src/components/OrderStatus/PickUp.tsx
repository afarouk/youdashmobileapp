import React from 'react';
import { Card } from '../Shared/Card/Card';
import format from 'date-fns/format'

type PickUpProps = {
  order: any,
  userName: string,
}

export const PickUp: React.FC<PickUpProps> = ({ order, userName }) => {
  const { 
    orderId, 
    pricePaid, 
    message, 
    cyclicOrderIdInt, 
    deliveryType, 
    tablePath,
    year,
    month,
    day,
    hour,
    minute,
  } = order || {};

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, __, tableId] = (tablePath || '').split('#');

  let pickupTimeStr = '';

  if (year && year > 0) {
    const pickupTime = new Date(year, month, day, hour, minute);
    pickupTimeStr = ` @ ${format(pickupTime, 'MMMM d, h:mmaaa')}`;
  }

  return (
    <Card className="order-status__pickup">
      <div className="flex">
        <p className="font-size-md">
          Order for <strong className="order-status__pickup-delivery-type">{deliveryType?.displayText}</strong>
          {pickupTimeStr}
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
