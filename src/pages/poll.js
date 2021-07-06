import React, { useState } from 'react';

import { OrderDetails } from '../components/OrderDetails/OrderDetails';
import usePoll from '../hooks/poll/usePoll';
import { Poll } from '../components/Poll/Poll';
import useNativeShare from '../hooks/useNativeShare';
import useMemberData from '../hooks/user/useMemberData';
import useMobileVerification from '../hooks/user/useMobileVerification';

const PollPage = ({ businessData, user }) => {
  const [updateMode, setUpdateMode] = useState(false);
  const toggleUpdateMode = () => setUpdateMode(!updateMode);
  const [onShare] = useNativeShare();

  const [
    credentials,
    credentialsChanged,
    onCredentialsChange,
    onSignUpSubmit,
    registerMemberRequestError
  ] = useMemberData(businessData, user, updateMode, toggleUpdateMode);

  const [
    isMobileVerified,
    verificationCode,
    verificationCodeError,
    onVerificationCodeChange,
    onSendVerificationCode,
    onResendVerificationCode
  ] = useMobileVerification(user);

  const [poll, choice, setChoice, pollResult, loading, setLoading, onPollSubmit] = usePoll(
    businessData
  );
  const handlePollSubmit = () => {
    if (choice) {
      if (user && !credentialsChanged) {
        setLoading(true);
        !isMobileVerified && verificationCode
          ? onSendVerificationCode()
              .then(() => {
                onPollSubmit(user);
              })
              .catch((error) => {
                if (error) {
                  setLoading(false);
                }
              })
          : onPollSubmit(user);
      } else {
        setLoading(true);
        onSignUpSubmit(updateMode, user, true)
          .then((user) => {
            setUpdateMode(false);
            setLoading(false);
            if (!user.adhocEntry && user.mobileVerified) {
              onPollSubmit(user);
            } else if (user.adhocEntry && !user.mobileVerified && verificationCode) {
              onSendVerificationCode().then(() => {
                onPollSubmit(user);
              });
            } else {
              setLoading(!!verificationCode);
            }
          })
          .catch((error) => {
            if (error) {
              setLoading(false);
              console.log(error);
            }
          });
      }
    }
  };

  const handleShare = () => {
    onShare({
      url: window.location.href,
      text: poll.displayText,
      title: poll.contestName
    });
  };

  return poll ? (
    <Poll
      user={user}
      registerMemberRequestError={registerMemberRequestError}
      credentials={credentials}
      onCredentialsChange={onCredentialsChange}
      isMobileVerified={isMobileVerified}
      verificationCode={verificationCode}
      verificationCodeError={verificationCodeError}
      onVerificationCodeChange={onVerificationCodeChange}
      onSendVerificationCode={onSendVerificationCode}
      onResendVerificationCode={onResendVerificationCode}
      updateMode={updateMode}
      toggleUpdateMode={toggleUpdateMode}
      poll={poll}
      pollResult={pollResult}
      choice={choice}
      onChoiceChange={setChoice}
      onPollSubmit={handlePollSubmit}
      onShare={handleShare}
      loading={loading}
    />
  ) : null;
};
export default PollPage;
