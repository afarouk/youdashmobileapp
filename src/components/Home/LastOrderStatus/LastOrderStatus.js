import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import './LastOrderStatus.css';
import { Card } from '../../Shared/Card/Card';
export const LastOrderStatus = ({ loyaltyAndOrderHistory }) => {
  let order = null;
  if (loyaltyAndOrderHistory.orderHistory && loyaltyAndOrderHistory.orderHistory.length) {
    order = loyaltyAndOrderHistory.orderHistory[0];
  }
  let history = useHistory();
  const { search } = useLocation();
  let { businessUrlKey } = useParams();
  const handleOrderStatus = () =>
    history.push(`/${businessUrlKey}/order-status/${order.orderUUID}${search}`);
  if (!order || order.orderStatus === 'FULFILLED') return null;

  return (
    <Card className={'last-order'}>
      <Button
        size={'large'}
        onClick={handleOrderStatus}
        type="primary"
        className="track-last-order-btn"
      >
        Track Last Order
      </Button>
    </Card>
  );
};

LastOrderStatus.propTypes = {
  loyaltyAndOrderHistory: PropTypes.object.isRequired
};
