import React from 'react';

import { ReservationFields } from './ReservationFields';
import { Form } from '../Shared/Form/Form';

import useMemberData from '../../hooks/user/useMemberData';

import { Alert, Button } from 'antd';
import { BusinessData } from '../../types/businessData';
import { User } from '../../types/user';
import { Card } from '../Shared/Card/Card';
import { UserDataForm } from '../Shared/UserDataForm/UserDataForm';
import { UserDetails } from '../Shared/UserDataForm/UserDetails';
import { VerificationCode } from '../OrderDetails/VerificationCode/VerificationCode';
import { LoadingElement } from '../Shared/LoadingElement';
import * as reservationTypes from '../../types/reservation';

type Props = { 
  businessData: BusinessData,
  user: User,
  loading: boolean,
  error: string | null | undefined,
  verificationCode: string,
  isMobileVerified: boolean,
  onVerificationCodeChange: any,
  onResendVerificationCode: any,
  verificationCodeError: string | null,
  reservation?: reservationTypes.Reservation | null,
  onSubmit: (event: React.FormEvent) => void,

  credentials: any,
  onCredentialsChange: any,
  registerMemberRequestError: any,
  userLoading: any,
}

export const Reservation: React.VFC<Props> = ({ 
  businessData, 
  user,
  loading,
  error,
  verificationCode,
  isMobileVerified,
  onVerificationCodeChange,
  onResendVerificationCode,
  verificationCodeError,
  reservation,
  onSubmit,

  credentials,
  onCredentialsChange,
  registerMemberRequestError,
  userLoading,
}) => {


  const hasReservation = Boolean(reservation)

  return (
    <div className="p-default">
      <Form onSubmit={onSubmit} className="mb-default">
        <ReservationFields 
          businessData={businessData} 
          user={user} 
        />

        <LoadingElement 
          loading={userLoading}
          loadingFallback={<Card style={{ height: 230 }} />}
        >
          <div>
            {!user && (
              <Card>
                <UserDataForm
                  user={user}
                  onChange={onCredentialsChange}
                  credentials={credentials}
                />
              </Card>
            )}

            {user && <UserDetails user={user} />}

            {user && !isMobileVerified && (
              <VerificationCode
                onResend={onResendVerificationCode}
                onChange={onVerificationCodeChange}
                verificationCode={verificationCode}
                verificationCodeError={verificationCodeError}
              />
            )}
          </div>
        </LoadingElement>

        {registerMemberRequestError && (
          <Alert message={registerMemberRequestError} type="error" showIcon closable />
        )}

        {error && (
          <Alert
            className="mb-default"
            message={error}
            type="error"
          />
        )}

        <Button
          block
          size="large"
          type="primary"
          className="font-size-md"
          htmlType="submit"
          loading={loading}
          disabled={userLoading || hasReservation}
        >
          Book my table
        </Button>
      </Form>
    </div>
  )
}