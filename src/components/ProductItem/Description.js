import React from 'react';
import PropTypes from 'prop-types';

export const Description = ({ itemName, price, description }) => (
  <div className="product-description product-row">
    <div className="product-title font-size-lg">
      <h4 className="primary-text">{itemName}</h4>
      <h4 className="product-price">{price}$</h4>
    </div>
    <div className="product-description-text">{description}</div>
  </div>
);

Description.propTypes = {
  itemName: PropTypes.string.isRequired,
  price: PropTypes.any,
  description: PropTypes.any
};
