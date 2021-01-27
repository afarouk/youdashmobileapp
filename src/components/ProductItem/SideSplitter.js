import React from 'react';
import PropTypes from 'prop-types';

export const SideSplitter = ({ side = 'left' }) => (
  <h4 className={`submenu-items-side-header submenu-items-side-header-${side}`}>
    <span className="font-size-md">{side} side options</span> <span className="options-circle" />
  </h4>
);

SideSplitter.propTypes = {
  side: PropTypes.string.isRequired
};
