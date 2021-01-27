import React from 'react';
import { Select as AntDSelect } from 'antd';
import usePickUpSelectors from '../../../hooks/usePickUpSelectors';

const { Option } = AntDSelect;

export const PickUpSelectors = ({ user, businessData }) => {
  const [orderPickUp, dayOptions, timeOptions, onTimeChange, onDayChange] = usePickUpSelectors(
    businessData
  );
  return (
    <>
      <AntDSelect
        placeholder={'Day'}
        value={orderPickUp.day}
        defaultValue={orderPickUp.day}
        onChange={onDayChange}
        className="primary-text-picker"
      >
        {dayOptions.map(({ label, value }, i) => (
          <Option value={value} key={`day${i}`}>
            {label}
          </Option>
        ))}
      </AntDSelect>
      <AntDSelect
        placeholder={'Time'}
        notFoundContent={<div>No options available please select another day</div>}
        value={orderPickUp.time}
        defaultValue={orderPickUp.time}
        onChange={onTimeChange}
        className="primary-text-picker"
      >
        {timeOptions.map(({ label, value }, i) => (
          <Option value={value} key={`timeOption${i}`}>
            {label}
          </Option>
        ))}
      </AntDSelect>
    </>
  );
};
