import React from 'react';

import useMobileVerification from '../hooks/user/useMobileVerification';
import { useAddReservation } from '../hooks/reservation/useAddReservation';

import { Reservation } from '../components/Reservation/Reservation';

import { BusinessData } from '../types/businessData';
import { User } from '../types/user';

type Props = {
  businessData: BusinessData,
  user: User,
}

const ReservationPage: React.FC<Props> = ({ businessData, user }) => {
  const {
    addReservation,
    addReservationError,
    addReservationLoading,
  } = useAddReservation();

  const [
    isMobileVerified,
    verificationCode,
    verificationCodeError,
    onVerificationCodeChange,
    onSendVerificationCode,
    onResendVerificationCode
  ] = useMobileVerification(user);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (addReservationLoading) {
      return;
    }

    if (user && isMobileVerified) {
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
    error={addReservationError}
  />
}

export default ReservationPage;
