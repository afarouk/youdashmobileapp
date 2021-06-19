import React from 'react';
import { useTimer } from 'react-timer-hook';

import { pad } from '../../../utils/helpers';

import './Timer.css';

type Props = {
  startDate: number, // Timestamp
  durationS: number, // Duration in seconds
  onExpire: () => void,
}

// Use this example -> https://codepen.io/cMack87/pen/rVmEQm
export const Timer: React.FC<Props> = ({
  startDate,
  durationS,
  onExpire,
}) => {
  const expireDate = new Date(startDate);
  expireDate.setSeconds(expireDate.getSeconds() + durationS);

  const {
    seconds,
    minutes,
    isRunning,
  } = useTimer({ 
    expiryTimestamp: expireDate.getTime(), 
    onExpire,
  });

  return (
    <span className={`timer-root ${isRunning ? '' : 'timer-root--expired'}`}>{pad(minutes)}:{pad(seconds)}</span>
  )
}