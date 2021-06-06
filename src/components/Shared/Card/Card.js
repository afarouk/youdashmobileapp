import React from 'react';
import PropTypes from 'prop-types';
import './Card.css';
export const Card = ({ children, className = '' }) => (
  <div className={`card p-default bg-secondary ${className}`}>{children}</div>
);

Card.propTypes = {
  children: PropTypes.any.isRequired
};
