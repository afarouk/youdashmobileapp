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
  onSubmit: (event: React.FormEvent) => void
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
  onSubmit,
}) => {

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [credentials, credentialsChanged, onCredentialsChange, onSignUpSubmit, registerMemberRequestError, userLoading] = useMemberData(
    businessData,
    user
  );

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

            {registerMemberRequestError && (
              <Alert message={registerMemberRequestError} type="error" showIcon closable />
            )}
          </div>
        </LoadingElement>

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
          disabled={userLoading}
        >
          Book my table
        </Button>
      </Form>
    </div>
  )
}