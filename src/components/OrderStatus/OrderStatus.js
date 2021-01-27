import React from 'react';
import PropTypes from 'prop-types';
import { Container } from '../Shared/Container/Container';
import { Button } from 'antd';
import { PickUp } from './PickUp';
import { Directions } from './Directions';
import { OrderTimeLine } from './OrderTimeLine';
import { OrderBarcode } from './OrderBarcode';
import './OrderStatus.css';
export const OrderStatus = ({
  user,
  order,
  mobileOrderStatuses,
  mapCoordinates,
  address,
  isDemo,
  saslName
}) => {
  const { orderId, orderStatus } = order || {};
  const { latitude, longitude } = mapCoordinates;

  return (
    <Container className={'order-status'}>
      <PickUp order={order} userName={user ? user.firstName : ''} />
      <Directions
        lat={latitude}
        lng={longitude}
        address={address}
        saslName={saslName}
        isDemo={isDemo}
      />
      <OrderBarcode value={`ocg_${orderId ? orderId : ''}`} />
      <OrderTimeLine
        orderStatus={orderStatus ? orderStatus : {}}
        mobileOrderStatuses={mobileOrderStatuses}
      />
     {/* <Button block size="large">
        <span className="font-size-md">Add to Home Screen</span>
      </Button>*/}
    </Container>
  );
};
OrderStatus.propTypes = {
  user: PropTypes.object,
  order: PropTypes.object,
  mobileOrderStatuses: PropTypes.object,
  mapCoordinates: PropTypes.object
};
