import React from 'react';

import { Directions } from '../OrderStatus/Directions';
import { LoadingElement } from '../Shared/LoadingElement';

import { User } from '../../types/user';
import { Reservation } from '../../types/reservation';
import { ReservationInfoCard } from './ReservationInfoCard';
import { BarcodeCard } from '../Shared/BarcodeCard';

type Props = {
  user: User,
  reservation: Reservation | null,
  mapCoordinates: {
    latitude: number,
    longitude: number,
  },
  isDemo: boolean,
  address?: string,
  saslName: string,
  storeFrontImageURL: string,
  barcode: string,
}

export const ReservationDetails: React.VFC<Props> = ({
  user,
  reservation,
  mapCoordinates,
  isDemo,
  saslName,
  address,
  storeFrontImageURL,
  barcode,
}) => {
  return (
    <LoadingElement loading={false} className="p-default">
      <ReservationInfoCard reservation={reservation} />
      <Directions
        lat={mapCoordinates.latitude}
        lng={mapCoordinates.longitude}
        address={address}
        saslName={saslName}
        isDemo={isDemo}
        storeFrontImageURL={storeFrontImageURL}
      />
      <BarcodeCard value={barcode} />
    </LoadingElement>
  )
}