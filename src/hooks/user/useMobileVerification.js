import { useEffect, useState } from 'react';
import {
  sendVerificationCodeRequest,
  resendVerificationCodeRequest
} from '../../redux/slices/auth';
import { useDispatch } from 'react-redux';
export default (user) => {
  const dispatch = useDispatch();
  const [isMobileVerified, setIsMobileVerified] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationCodeError, setVerificationCodeError] = useState(null);
  const handleVerificationCodeChange = (e) => setVerificationCode(e.target.value);
  const handleSendVerificationCode = () => {
    if (user && user.uid && verificationCode) {
      setVerificationCodeError(false);
      return dispatch(
        sendVerificationCodeRequest({
          smsCode: verificationCode,
          UID: user.uid
        })
      ).then(({ payload, error }) => {
        if (error) {
          setVerificationCodeError(error.message ? error.message : 'Verification code error.');
          return Promise.reject(error.message ? error.message : 'Verification code error.');
        }
        return Promise.resolve(payload);
      });
    }
  };

  const handleResendVerificationCode = () => {
    if (user && user.uid) {
      return dispatch(resendVerificationCodeRequest(user.uid));
    }
  };

  useEffect(() => {
    if (user && user.mobileVerified && !user.adhocEntry && !isMobileVerified) {
      setIsMobileVerified(true);
    }
  }, [user]);

  return [
    isMobileVerified,
    verificationCode,
    verificationCodeError,
    handleVerificationCodeChange,
    handleSendVerificationCode,
    handleResendVerificationCode
  ];
};
