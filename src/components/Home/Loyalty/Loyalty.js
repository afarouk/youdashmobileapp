import React, { memo } from 'react';
import PropTypes from 'prop-types';
import './Loyalty.css';

import { Card } from '../../Shared/Card/Card';
import { CheckIcon } from '../../Shared/Icons/Icons';

export const Loyalty = memo(({ loyaltyAndOrderHistory }) => {
  const { loyaltyForUser } = loyaltyAndOrderHistory;
  if (!loyaltyForUser || !loyaltyForUser.hasLoyaltyProgram || !loyaltyForUser.loyaltyStatus)
    return null;
  const {
    programName,
    itemName,
    currentCount,
    triggerCount,
    applyDiscount
  } = loyaltyForUser.loyaltyStatus;
  return (
    <Card className="bg-primary loyalty">
      <h4 className="font-size-lg primary-text">My Rewards</h4>
      <p className="primary-text font-size-lg">"{programName}"</p>
      <div className="loyalty__progress">
        <div className="loyalty__progress-bar">
          {Array(triggerCount)
            .fill(0)
            .map((v, i) => (
              <div
                key={`loyaltyProgress${i}`}
                // style={{ width: `${100 / triggerCount}%` }}
                className={`loyalty__progress-bar-block ${i < currentCount ? 'active' : ''}`}
              >
                {i < currentCount ? <CheckIcon /> : null}
              </div>
            ))}
        </div>
        <div className="loyalty__progress-item primary-text">
          {applyDiscount ? <strong>{itemName}</strong> : itemName}
        </div>
      </div>
    </Card>
  );
});

Loyalty.propTypes = {
  loyaltyAndOrderHistory: PropTypes.object
};
