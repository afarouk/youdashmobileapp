import React from 'react';
import PropTypes from 'prop-types';
import './Form.css';
export const Form = ({ onSubmit, children, className = '' }) => (
  <form onSubmit={onSubmit} className={`form ${className}`}>
    {children}
  </form>
);

Form.propTypes = {
  children: PropTypes.any,
  onSubmit: PropTypes.func.isRequired
};
