import React from 'react';
import PropTypes from 'prop-types';

export const Qty = ({ quantity }) => (
  <td className="order-items-list-table__qty">
    <span className="font-size-sm">x{quantity}</span>
  </td>
);

Qty.propTypes = {
  quantity: PropTypes.number.isRequired
};
