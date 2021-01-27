import React from 'react';
import PropTypes from 'prop-types';
import './ImagePlaceholder.css';
export const ImagePlaceholder = ({ children, minHeight = 200 }) => (
  <div className="image-placeholder-bg" style={{ minHeight: minHeight }}>
    {children}
  </div>
);

ImagePlaceholder.propTypes = {
  children: PropTypes.any
};
