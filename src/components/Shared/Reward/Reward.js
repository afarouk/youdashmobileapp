import React from 'react';
import PropTypes from 'prop-types';
import { Card } from '../Card/Card';
import {TagIcon} from "../Icons/Icons";

export const Reward = ({ text, expires, type }) => (
  <Card className={`reward reward-${type} ${type === 'solid' ? 'bg-primary' : 'border-dashed'}`}>
    <div className="reward-row">
      <div className={`reward-tag-icon bg-primary`}>
        <TagIcon />
      </div>
      <p>{text}</p>
    </div>
    <p className="reward-expires">
      <span>
        Expires <span className={`${type === 'dashed' ? 'primary-text' : ''}`}>{expires}</span>
      </span>{' '}
      <span className="reward-expires-terms">Terms & conditions apply*</span>
    </p>
  </Card>
);

Reward.propTypes = {
  text: PropTypes.string,
  expires: PropTypes.string,
  type: PropTypes.string
};
