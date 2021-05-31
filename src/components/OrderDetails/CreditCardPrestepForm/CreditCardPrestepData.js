import React from 'react';
import PropTypes from 'prop-types';

import { Card } from '../../Shared/Card/Card';
import { EditIcon } from '../../Shared/Icons/Icons';

import './CreditCardPrestepData.css';

export const CreditCardPrestepData = ({ data, toggleUpdateMode }) => {
  return (
    <Card className="credit-card-prestep-data">
      <h4 className="flex font-size-lg primary-text">
        <span>Billing Address</span>
        {toggleUpdateMode && (
          <span onClick={toggleUpdateMode}>
            <EditIcon />
          </span>
        )}
      </h4>
      <h5 className="flex">
        <span>Street:</span>
        <span>{data.streetAddress}</span>
      </h5>
      {data.streetAddressDetails && (
        <h5 className="flex">
          <span>Apt, Suite, Bldg(optional):</span>
          <span>{data.streetAddressDetails}</span>
        </h5>
      )}
      <h5 className="flex">
        <span>ZIP:</span>
        <span>{data.zipCode}</span>
      </h5>
    </Card>
  );
};

CreditCardPrestepData.propTypes = {
  data: PropTypes.object,
};
