import React from 'react';
import PropTypes from 'prop-types';
import { Card } from '../../../Shared/Card/Card';
import { Link, useParams, useLocation } from 'react-router-dom';
import './PollPreview.css';
export const PollPreview = ({ poll }) => {
  const { businessUrlKey } = useParams();
  const { search } = useLocation();
  const { contestUUID, imageURL, displayText } = poll;
  return (
    <Link
      to={`/${businessUrlKey}/poll/${contestUUID}${search}`}
      className={`card bg-secondary p-default poll-preview`}
    >
      <img src={imageURL} alt="" />
      <h4 className='font-size-md'>{displayText}</h4>
    </Link>
  );
};

PollPreview.propTypes = {
  poll: PropTypes.object.isRequired
};
