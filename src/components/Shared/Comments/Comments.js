import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';
import './Comments.css';
const { TextArea } = Input;

export const Comments = ({ value, placeholder, onTextChange }) => (
  <div className="comments bg-secondary">
    <TextArea
      className="bg-secondary"
      placeholder={placeholder}
      multiple
      rows={4}
      value={value}
      onChange={onTextChange}
    />
  </div>
);

Comments.propTypes = {
  value: PropTypes.string,
  placeholder: PropTypes.string,
  onTextChange: PropTypes.func.isRequired
};
