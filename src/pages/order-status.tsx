import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { OrderStatus } from '../components/OrderStatus/OrderStatus';
import { useSelector } from '../redux/store';
import { orderAPI } from '../services/api';
import { formatGMapAddress } from '../utils/helpers';

const OrderStatusPage: React.FC<any> = ({ user, businessData }) => {
  const { orderUUID } = useParams<{orderUUID: string}>();
  const [order, setOrder] = useState(null);
  const orderStatus = useSelector((state) => state.shoppingCart.orderStatus);
  const storeFrontImageURL = useSelector((state) => state.business.data.storeFrontImageURL);

  useEffect(() => {
    if (orderStatus && !order && orderStatus.orderUUID === orderUUID) {
      setOrder(orderStatus);
    }
  }, [orderStatus]);

  useEffect(() => {
    if (orderUUID && user && user.uid && !order) {
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
      mapCoordinates={businessData.mapCoordinates || {}}
      address={address}
      saslName={businessData.saslName}
      isDemo={businessData.isDemo}
      storeFrontImageURL={storeFrontImageURL}
    />
  );
};
export default OrderStatusPage;
