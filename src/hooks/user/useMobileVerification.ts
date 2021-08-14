import { useEffect, useState } from 'react';
import {
  sendVerificationCodeRequest,
  resendVerificationCodeRequest
} from '../../redux/slices/auth';
import { useDispatch } from '../../redux/store';
import { User } from '../../types/user';

type UseMobileVerificationResult = [
  boolean,
  string,
  string | null,
  (e: any) => void,
  () => any,
  () => Promise<any> | undefined,
]

export default (user: User): UseMobileVerificationResult => {
  const dispatch = useDispatch();
  const [isMobileVerified, setIsMobileVerified] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationCodeError, setVerificationCodeError] = useState<string | null>(null);
  const handleVerificationCodeChange = (e: any) => setVerificationCode(e.target.value);
  const handleSendVerificationCode = () => {
    if (user && user.uid && verificationCode) {
      setVerificationCodeError(null);
      return dispatch(
        sendVerificationCodeRequest({
          smsCode: verificationCode,
          UID: user.uid
        })
      ).then(({ payload, error }: any) => {
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
