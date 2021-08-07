import React from 'react';

import { Reservation } from '../components/Reservation/Reservation';

import { BusinessData } from '../types/businessData';
import { User } from '../types/user';

type Props = {
  businessData: BusinessData,
  user: User,
}

const ReservationPage: React.FC<Props> = ({ businessData, user }) => {

  return <Reservation businessData={businessData} user={user} />
}

export default ReservationPage;
