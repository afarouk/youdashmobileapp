import React from 'react';
import PropTypes from 'prop-types';
import './NativeSelect.css';
export const NativeSelect = ({ options, value, onChange }) => {
  const handleChange = (e) => onChange(+e.target.value);
  return (
    <select className="native-select bg-secondary" id="version-select" value={value} onChange={handleChange}>
      {options.map(({ itemVersion, version1DisplayText }, vIndex) => (
        <option value={itemVersion} key={`itemVersion${vIndex}`}>
          {version1DisplayText}
        </option>
      ))}
    </select>
  );
};

NativeSelect.propTypes = {
  options: PropTypes.array,
  value: PropTypes.number,
  onChange: PropTypes.func.isRequired
};
