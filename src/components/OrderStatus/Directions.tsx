import React from 'react';
import { Card } from '../Shared/Card/Card';

import './Directions.css'

type Props = {
  lat: number, 
  lng: number, 
  address?: string, 
  isDemo: boolean, 
  saslName: string,
  storeFrontImageURL: string,
}

export const Directions: React.FC<Props> = ({ lat, lng, address, isDemo, saslName, storeFrontImageURL }) => {
  return (
    <Card className="order-status__directions">
      <h4 className="font-size-md">For driving directions click below</h4>
      <img src={storeFrontImageURL} alt="store" className="order-status__directions-image" />
      <a
        className="ant-btn ant-btn-block"
        target="_blank"
        href={`https://www.google.com/maps?daddr=${lat},${lng}`}
      >
        Directions
      </a>
    </Card>
  );
};