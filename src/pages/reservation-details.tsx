import React from 'react';

import { formatGMapAddress } from '../utils/helpers';

import { ReservationDetails } from '../components/ReservationDetails/ReservationDetails';

import { BusinessData } from '../types/businessData';
import { User } from '../types/user';
import { useReservationDetails } from '../hooks/reservation/useReservationDetails';

type Props = {
  businessData: BusinessData,
  user: User,
}

const ReservationDetailsPage: React.FC<Props> = ({ businessData, user }) => {
  const { address } = businessData.pickUp;
  const { 
    mapCoordinates,
    saslName,
    isDemo,
    storeFrontImageURL,
  } = businessData;

  const { reservation } = useReservationDetails();
  
  const formattedAddress = address ? formatGMapAddress(address) : '';

  return (
    <ReservationDetails
      reservation={reservation}
      user={user}
      mapCoordinates={mapCoordinates || {}}
      saslName={saslName}
      isDemo={isDemo}
      address={formattedAddress}
      storeFrontImageURL={storeFrontImageURL}
    />
  )
}

export default ReservationDetailsPage;