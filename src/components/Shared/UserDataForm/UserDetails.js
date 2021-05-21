import React from 'react';
import PropTypes from 'prop-types';

import { Card } from '../Card/Card';
import { formatPhoneNumber } from '../../../utils/helpers';
import { EditIcon } from '../Icons/Icons';
import './UserDataForm.css';
export const UserDetails = ({ user, toggleUpdateMode }) => {
  return (
    <Card className="user-details">
      <h4 className="flex font-size-lg primary-text">
        <span>How will we contact you?</span>
        {toggleUpdateMode && (
          <span onClick={toggleUpdateMode}>
            <EditIcon />
          </span>
        )}
      </h4>
      <h5 className="flex">
        <span>Name:</span>
        <span>{user.firstName}</span>
      </h5>
      <h5 className="flex">
        <span>Phone:</span>
        <span>{formatPhoneNumber(user.phoneNumber)}</span>
      </h5>
      <h5 className="flex">
        <span>E-mail:</span>
        <span>{user.email}</span>
      </h5>
      {user.kUID && (
        <h5 className="flex">
          <span>Key-tag ID:</span>
          <span>{user.kUID}</span>
        </h5>
      )}
    </Card>
  );
};

UserDetails.propTypes = {
  user: PropTypes.object,
};
