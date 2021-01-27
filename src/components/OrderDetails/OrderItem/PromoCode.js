import React from 'react';
import PropTypes from 'prop-types';

export const PromoCode = ({ code }) => (
  <td className="order-items-list-table__qty">
    <span>{code}</span>
  </td>
);

PromoCode.propTypes = {
  code: PropTypes.string.isRequired
};
