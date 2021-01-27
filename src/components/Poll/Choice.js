import React from 'react';
import PropTypes from 'prop-types';
import { CheckIcon } from '../Shared/Icons/Icons';
import { Button } from 'antd';

export const Choice = ({ choiceId, onChoiceChange, activeChoice, displayText }) => {
  const isActiveChoice = choiceId === activeChoice;
  return (
    <Button
      key={`poll${choiceId}`}
      block
      onClick={() => onChoiceChange(choiceId)}
      className={`poll__button ${isActiveChoice ? 'active' : ''}`}
    >
      {isActiveChoice && <CheckIcon />}
      <span className='font-size-md'>{displayText}</span>
    </Button>
  );
};

Choice.propTypes = {
  choiceId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  activeChoice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  displayText: PropTypes.string,
  onChoiceChange: PropTypes.func.isRequired
};
