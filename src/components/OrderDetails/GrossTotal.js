import React from 'react';
import PropTypes from 'prop-types';

export const GrossTotal = ({ total }) => (
  <div>
    <h5 className="flex font-size-lg total">
      <span>Total</span>
      <span>${total.toFixed(2)}</span>
    </h5>
  </div>
);

GrossTotal.propTypes = {
  total: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};
