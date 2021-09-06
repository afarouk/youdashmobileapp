import React, { useEffect, useState} from 'react';

import useMobileVerification from '../hooks/user/useMobileVerification';
import { useAddReservation } from '../hooks/reservation/useAddReservation';

import { Reservation } from '../components/Reservation/Reservation';

import { BusinessData } from '../types/businessData';
import { User } from '../types/user';
import { ROUTE_NAME, useRouting } from '../hooks/useRouting';
import { useReservationDetails } from '../hooks/reservation/useReservationDetails';
import useMemberData from '../hooks/user/useMemberData';
import { useDispatch } from '../redux/store';
import { setUserAuthorizationInProgress } from '../redux/slices/reservationSlice';

type Props = {
  businessData: BusinessData,
  user: User,
}

const ReservationPage: React.FC<Props> = ({ businessData, user }) => {
  const { goTo } = useRouting();
  const [formError, setFormError] = useState('');

  const dispatch = useDispatch();

  const {
    addReservation,
    addReservationError,
    addReservationLoading,
    reservationEnabled,
    reservationDate,
  } = useAddReservation();

  const [
    credentials,
    credentialsChanged,
    handleCredentialsChange,
    onSignUpSubmit,
    registerMemberRequestError,
    userLoading,
  ] = useMemberData(businessData, user);

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
      if (!reservationEnabled) {
        goTo({ routeName: ROUTE_NAME.LANDING });
      }
    }
  }, [businessData, reservation])

  const sendVerificationAnd = async (fn: any) => {
    if (!isMobileVerified && verificationCode) {
      await onSendVerificationCode();
      await fn();
    } else {
      await fn();
    }
  }

  const signUpUser = async () => {
    setUserAuthorizationInProgress(true);
    let userData;

    try {
      userData = await onSignUpSubmit(false, user, true);
    } catch (err) {
      setUserAuthorizationInProgress(false);
      return;
    }

    setUserAuthorizationInProgress(false);

    return { userData };
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError('');

    if (addReservationLoading) {
      return;
    }

    if (user && !credentialsChanged) {
      if (!reservationDate) {
        setFormError('Preferred time is not provided');
        return;
      }

      // TODO pickup selectors validation here

      await sendVerificationAnd(addReservation);
    } else {
      // register user or handle user login
      const result = await signUpUser();

      if (result && result.userData){
       const { userData } = result;
        const { adhocEntry, mobileVerified} = userData;

        if (!adhocEntry && mobileVerified) {
          await addReservation(userData);
        } else if (adhocEntry && !mobileVerified && verificationCode) {
          setUserAuthorizationInProgress(true);
          await onSendVerificationCode();
          // proceedToNextStepForCardPayment();
          setUserAuthorizationInProgress(false);
        }
      } else {
        // TODO: hosw error here?
      }

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
    reservation={reservation}
    credentials={credentials}
    onCredentialsChange={handleCredentialsChange}
    registerMemberRequestError={registerMemberRequestError}
    userLoading={userLoading}
  />
}

export default ReservationPage;
