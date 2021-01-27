import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { CheckIcon } from '../Shared/Icons/Icons';

export const PollResult = ({ choice }) => {
  const { choiceId, displayText, isCorrect, percentOfTotalResponses, thisIsYourChoice } = choice;
  const [percent, setPercent] = useState(0);
  useEffect(() => {
    setTimeout(() => setPercent(parseInt(percentOfTotalResponses, 10)), 100);
  }, [percentOfTotalResponses]);
  return (
    <div
      className={`poll__result-choice flex ${thisIsYourChoice ? 'user-choice' : ''}`}
      key={`pollResult${choiceId}`}
    >
      <div className="poll__result-choice-progress" style={{ width: `${percent}%` }} />
      <span className="poll__result-choice-title font-size-md">
        {isCorrect ? <CheckIcon /> : null}
        {displayText}
      </span>
      <span className="poll__result-choice-percent font-size-md">{percent}%</span>
    </div>
  );
};

PollResult.propTypes = {
  choice: PropTypes.object.isRequired
};
