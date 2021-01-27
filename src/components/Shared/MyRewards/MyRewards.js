import React from 'react';
import PropTypes from 'prop-types';
import './MyRewards.css';
import { ReactComponent as Trophy } from '../../../assets/icons/trophy.svg';
import { Card } from '../Card/Card';
export const MyRewards = ({ credits = 0 }) => (
  <Card className="loyalty bg-primary">
    <Trophy />
    <h4 className="loyalty-title">My Rewards</h4>
    <div className="loyalty-summary">
      <div>
        <span className="loyalty-summary-credits">{credits}</span> <span>Credits</span>
      </div>
      <span className="loyalty-swipe">Swipe right for discounts</span>
    </div>
  </Card>
);

MyRewards.propTypes = {
  credits: PropTypes.any
};
