import React from 'react';
import { Select as AntDSelect } from 'antd';
import usePickUpSelectors from '../../../hooks/usePickUpSelectors';
import { formatDeliveryDate, getReadableTime } from '../../../utils/helpers';
import { useSelector } from '../../../redux/store';
import { ORDERING_STATE } from '../../../types/greenDining';

const { Option } = AntDSelect;

export const PickUpSelectors: React.FC<any> = ({ user, businessData }) => {
  let {orderPickUp, dayOptions, timeOptions, handleTimeChange, handleDayChange, timeZone} = usePickUpSelectors(
    businessData
  );

  let selectedDate = orderPickUp.date;
  let selectedTime = orderPickUp.time;


  // green dining rewrites normal business options
  const greenDiningInfo = useSelector(state => state.greenDining.data);
  const isGreenDiningOrdering = useSelector(state => state.greenDining.orderingState === ORDERING_STATE.STARTED);

  if (isGreenDiningOrdering) {
    // day
    const { year, month, day, displayText  } = greenDiningInfo?.pickupDayTime.day || {}
    const dayOption = { year, month, day, label: displayText }
    selectedDate = formatDeliveryDate(dayOption);
    dayOptions = [dayOption]

    // time
    const { hour, minute } = greenDiningInfo?.pickupDayTime.times[0] || {};
    const timeOption = {
      value: `${hour}:${minute}:00`, 
      label: getReadableTime({ hours: hour, minutes: minute, timeZone }),
    }
    selectedTime = timeOption.value;
    timeOptions = [timeOption];
  }

  return (
    <>
      <AntDSelect
        placeholder={'Day'}
        value={selectedDate}
        defaultValue={selectedDate}
        onChange={handleDayChange}
        className="primary-text-picker"
        disabled={isGreenDiningOrdering}
      >
        {dayOptions.map((dayOption, i) => (
          <Option value={formatDeliveryDate(dayOption)} key={`date${i}`}>
            {dayOption.label}
          </Option>
        ))}
      </AntDSelect>
      <AntDSelect
        placeholder={'Time'}
        notFoundContent={<div>No options available please select another day</div>}
        value={selectedTime}
        defaultValue={selectedTime}
        onChange={handleTimeChange}
        className="primary-text-picker"
        disabled={isGreenDiningOrdering}
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
