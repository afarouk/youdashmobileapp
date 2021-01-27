import React from 'react';
import PropTypes from 'prop-types';

export const Image = ({ url, itemName }) => (
  <img className=" product-image" src={url} alt={itemName} />
);

Image.propTypes = {
  url: PropTypes.any.isRequired,
  itemName: PropTypes.string.isRequired
};
