import React from 'react';
import { Container } from '../Shared/Container/Container';
import { PickUp } from './PickUp';
import { Directions } from './Directions';
import { OrderTimeLine } from './OrderTimeLine';
import { BarcodeCard } from '../Shared/BarcodeCard';
import './OrderStatus.css';

type Props = {
  user: any,
  order: any,
  mapCoordinates: {
    latitude: number,
    longitude: number,
  },
  address: string,
  isDemo: boolean,
  saslName: string,
  storeFrontImageURL: string,
}

export const OrderStatus: React.FC<Props> = ({
  user,
  order,
  mapCoordinates,
  address,
  isDemo,
  saslName,
  storeFrontImageURL,
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
        storeFrontImageURL={storeFrontImageURL}
      />
      <BarcodeCard value={`ocg_${orderId ? orderId : ''}`} />
      <OrderTimeLine orderStatus={orderStatus} />
    </Container>
  );
};

