import React, { useEffect, useState } from 'react';
import { OrderHistory } from '../components/OrderHistory/OrderHistory';
import { useReorder } from '../hooks/order-details/useReorder';

import useGetUserSASLSummary from '../hooks/user/useGetUserSASLSummary';
import { ROUTE_NAME, useRouting } from '../hooks/useRouting';

const OrderHistoryPage = ({ loyaltyAndOrderHistory }) => {
  const { goTo } = useRouting();
  const [orderHistory, setOrderHistory] = useState([]);
  let [user, loyalty, reloadHistory, loading] = useGetUserSASLSummary();

  const { reorderItems } = useReorder();

  useEffect(() => {
    if (loyaltyAndOrderHistory && loyaltyAndOrderHistory.orderHistory) {
      setOrderHistory(loyaltyAndOrderHistory.orderHistory);
    }
  }, [loyaltyAndOrderHistory]);

  const handleReOrder = (items) => {
    if (items && items.length > 0) {
      reorderItems(items)
      goTo({ routeName: ROUTE_NAME.CART });
    }
  };
  return (
    <OrderHistory
      orders={orderHistory}
      onReOrder={handleReOrder}
      loading={loading}
      onReloadHistory={reloadHistory}
    />
  );
};

export default OrderHistoryPage;
