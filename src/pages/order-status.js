import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { OrderStatus } from '../components/OrderStatus/OrderStatus';
import { orderAPI } from '../services/api';
import { formatGMapAddress } from '../utils/helpers';
import { useSelector } from 'react-redux';

const OrderStatusPage = ({ user, businessData }) => {
  const { orderUUID } = useParams();
  const [order, setOrder] = useState(null);
  const orderStatus = useSelector((state) => state.shoppingCart.orderStatus);
  useEffect(() => {
    if (orderStatus && !order && orderStatus.orderUUID === orderUUID) {
      setOrder(orderStatus);
    }
  }, [orderStatus]);

  useEffect(() => {
    if (orderUUID && user && user.uid && !order && orderStatus?.orderUUID !== orderUUID) {
      orderAPI
        .getOrderStatus({
          orderUUID,
          UID: user.uid
        })
        .then((response) => {
          if (response.data) {
            setOrder(response.data);
          }
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderUUID, user]);

  let { address } = businessData.pickUp;
  if (address) {
    address = formatGMapAddress(address);
  }

  return (
    <OrderStatus
      user={user}
      order={order}
      mobileOrderStatuses={businessData.mobileOrderStatuses || {}}
      mapCoordinates={businessData.mapCoordinates || {}}
      address={address}
      saslName={businessData.saslName}
      isDemo={businessData.isDemo}
    />
  );
};
export default OrderStatusPage;
