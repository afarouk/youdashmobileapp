import React from 'react';
import PropTypes from 'prop-types';

import { ImagePlaceholder } from '../Shared/ImagePlaceholder/ImagePlaceholder';
import { Alert, Button } from 'antd';

import { Choice } from './Choice';

import { Prize } from './Prize';
import { VerificationCode } from '../OrderDetails/VerificationCode/VerificationCode';
import { PollResult } from './PollResult';
import { Card } from '../Shared/Card/Card';
import { UserDataForm } from '../Shared/UserDataForm/UserDataForm';
import { UserDetails } from '../Shared/UserDataForm/UserDetails';

import './Poll.css';

export const Poll = ({
  poll,
  choice,
  pollResult,
  loading,
  onChoiceChange,
  onPollSubmit,
  onShare,

  user,
  credentials,
  onCredentialsChange,
  updateMode,
  toggleUpdateMode,

  isMobileVerified,
  verificationCode,
  verificationCodeError,
  onVerificationCodeChange,
  onResendVerificationCode,
  registerMemberRequestError
}) => {
  const { contestUUID, imageURL, displayText, choices, prizes } = poll;

  return (
    <div className="p-default poll">
      {(prizes || []).map((prize, i) => (
        <Prize key={`prize${i}`} prize={prize} />
      ))}
      <ImagePlaceholder minHeight={100}>
        <img src={imageURL} alt="" className="poll__image" />
      </ImagePlaceholder>

      <h1 className="poll__heading font-size-lg">{displayText}</h1>
      {!pollResult
        ? (choices || []).map(({ choiceId, displayText }) => (
            <Choice
              activeChoice={choice}
              choiceId={choiceId}
              displayText={displayText}
              onChoiceChange={onChoiceChange}
              key={`poll${choiceId}`}
            />
          ))
        : (pollResult.choices || []).map((choice) => (
            <PollResult choice={choice} key={`pollResult${choice.choiceId}`} />
          ))}
      {(!user || (user.adhocEntry && !user.mobileVerified)) && !pollResult && (
        <>
          {(!user || (user && updateMode)) && (
            <Card>
              <UserDataForm
                user={user}
                toggleUpdateMode={toggleUpdateMode}
                updateMode={updateMode}
                shouldChangeUpdateMode={true}
                onChange={onCredentialsChange}
                credentials={credentials}
              />
            </Card>
          )}
          {user && !updateMode && <UserDetails user={user} toggleUpdateMode={toggleUpdateMode} />}
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
        </>
      )}

      {!pollResult ? (
        <Button
          size="large"
          block
          type="primary"
          loading={loading}
          disabled={!choice || !credentials.firstName || !credentials.email || !credentials.mobile}
          className="poll__submit-btn"
          onClick={onPollSubmit}
        >
          <span className="font-size-md">SUBMIT</span>
        </Button>
      ) : (
        <Button size="large" block className="poll__submit-btn" onClick={onShare}>
          <span className="font-size-md">SHARE</span>
        </Button>
      )}
    </div>
  );
};

Poll.propTypes = {
  poll: PropTypes.object,
  choice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChoiceChange: PropTypes.func.isRequired,
  onPollSubmit: PropTypes.func.isRequired
};
