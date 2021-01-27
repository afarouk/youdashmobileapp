import React from 'react';
import PropTypes from 'prop-types';

export const Price = ({ price }) => (
  <td className="order-items-list-table__price">
    <span>${price.toFixed(2)}</span>
  </td>
);

Price.propTypes = {
  price: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};
