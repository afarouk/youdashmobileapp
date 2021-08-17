import React, { useEffect, useState} from 'react';

import useMobileVerification from '../hooks/user/useMobileVerification';
import { useAddReservation } from '../hooks/reservation/useAddReservation';

import { Reservation } from '../components/Reservation/Reservation';

import { BusinessData } from '../types/businessData';
import { User } from '../types/user';
import { ROUTE_NAME, useRouting } from '../hooks/useRouting';
import { useReservationDetails } from '../hooks/reservation/useReservationDetails';

type Props = {
  businessData: BusinessData,
  user: User,
}

const ReservationPage: React.FC<Props> = ({ businessData, user }) => {
  const { goTo } = useRouting();
  const [formError, setFormError] = useState('');

  const {
    addReservation,
    addReservationError,
    addReservationLoading,
    reservationEnabled,
    reservationDate,
  } = useAddReservation();

  const { reservation } = useReservationDetails();

  const [
    isMobileVerified,
    verificationCode,
    verificationCodeError,
    onVerificationCodeChange,
    onSendVerificationCode,
    onResendVerificationCode
  ] = useMobileVerification(user);


  useEffect(() => {
    if (businessData) {
      if (!reservationEnabled || reservation) {
        goTo({ routeName: ROUTE_NAME.LANDING });
      }
    }
  }, [businessData, reservation])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError('');

    if (addReservationLoading) {
      return;
    }

    if (user && isMobileVerified) {
      if (!reservationDate) {
        setFormError('Preferred time is not provided');
        return;
      }

      // TODO pickup selectors validation here

      await addReservation();
    } else {
      // register user or handle user login
    }
  }


  return <Reservation 
    businessData={businessData} 
    user={user} 
    verificationCode={verificationCode}
    isMobileVerified={isMobileVerified}
    onVerificationCodeChange={onVerificationCodeChange}
    onResendVerificationCode={onResendVerificationCode}
    verificationCodeError={verificationCodeError}
    onSubmit={handleSubmit}
    loading={addReservationLoading}
    error={formError || addReservationError}
  />
}

export default ReservationPage;
