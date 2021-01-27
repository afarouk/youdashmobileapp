import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Input, Button, Alert } from 'antd';
import InputMask from 'react-input-mask';
import { Card } from '../../Shared/Card/Card';
import './VerificationCode.css';
export const VerificationCode = ({
  verificationCode,
  verificationCodeError,
  onChange,
  onResend
}) => {
  const [resendInProgress, setResendInProgress] = useState(false);
  const [resendError, setResendError] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const handleResend = () => {
    setResendInProgress(true);
    setIsSent(false);
    onResend().then(({ payload, error }) => {
      setResendInProgress(false);
      if (error) {
        return setResendError(error.message ? error.message : 'Resend code error.');
      }
      setIsSent(true);
    });
  };
  return (
    <>
      <Card className='verification-code'>
        <h3>Please enter verification code</h3>
        <div className="flex">
          <Button
            className="resend-btn"
            type="link"
            loading={resendInProgress}
            disabled={resendInProgress}
          >
            <span className="resend-btn__title" onClick={handleResend}>
              Resend Code
            </span>
          </Button>
          <InputMask mask="9999" value={verificationCode} onChange={onChange}>
            {(inputProps) => (
              <Input
                {...inputProps}
                autoComplete="off"
                placeholder="Code"
                name="verificationCode"
                required
              />
            )}
          </InputMask>
        </div>
        {resendError && <Alert message={resendError} type="error" showIcon closable />}
        {isSent && <Alert message={'Code resent successfully'} type="success" showIcon closable />}
        {verificationCodeError && (
          <Alert message={verificationCodeError} type="error" showIcon closable />
        )}
      </Card>
    </>
  );
};

VerificationCode.propTypes = {
  verificationCode: PropTypes.string,
  onChange: PropTypes.func.isRequired
};
