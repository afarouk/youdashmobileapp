import React from 'react';

import { ReservationForm } from './ReservationForm';
import { Form } from '../Shared/Form/Form';

import { BusinessData } from '../../types/businessData';
import { User } from '../../types/user';
import { Card } from '../Shared/Card/Card';
import { UserDataForm } from '../Shared/UserDataForm/UserDataForm';
import { UserDetails } from '../Shared/UserDataForm/UserDetails';

type Props = { 
  businessData: BusinessData,
  user: User,
}

export const Reservation: React.VFC<Props> = ({ businessData, user }) => {
  return (
    <div className="p-default">
      <ReservationForm businessData={businessData} user={user} />

      {/* <Form onSubmit={(e) => onSubmitHandler(e)}> */}
      <Form onSubmit={console.log} className="mb-default">
        {/* {!user && (
          <Card>
            <UserDataForm
              user={user}
              updateMode={updateMode}
              shouldChangeUpdateMode={true}
              onChange={onCredentialsChange}
              credentials={credentials}
            />
          </Card>
        )} */}

        {user && <UserDetails user={user} />}

        {/* {user && !isMobileVerified && (
          <VerificationCode
            onResend={onResendVerificationCode}
            onChange={onVerificationCodeChange}
            verificationCode={verificationCode}
            verificationCodeError={verificationCodeError}
          />
        )} */}

        {/* {registerMemberRequestError && (
          <Alert message={registerMemberRequestError} type="error" showIcon closable />
        )} */}
      </Form>
    </div>
  )
}