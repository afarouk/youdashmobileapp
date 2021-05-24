import { useEffect, useState } from 'react';
import differenceInMinutes from 'date-fns/differenceInMinutes';
import { setOrderPickUp } from '../redux/slices/shoppingCart';
import { useDispatch, useSelector } from 'react-redux';
import {addLeadingZero, changeTimezone, formatDeliveryDate, isToday, getDayNameByIndex } from '../utils/helpers';

const getTimeString = (hours, minutes, pickupDate, timeZone) => {
  let date = changeTimezone(new Date(), timeZone);
  date.setHours(+hours);
  date.setMinutes(+minutes);
  let options = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  };
  let currentDate = changeTimezone(new Date(), timeZone);

  if (pickupDate && isToday(pickupDate)) {
    return differenceInMinutes(currentDate, date) < 0
      ? {
          label: date.toLocaleString('en-US', options),
          value: `${hours}:${addLeadingZero(minutes)}:00`
        }
      : null;
  }
  return {
    label: date.toLocaleString('en-US', options),
    value: `${hours}:${addLeadingZero(minutes)}:00`
  };
};
export default (businessData) => {
  const [dayOptions, setDayOptions] = useState([]);
  const [timeOptions, setTimeOptions] = useState([]);
  let dispatch = useDispatch();
  const orderPickUp = useSelector((state) => state.shoppingCart.orderPickUp);

  let pickUpTimes = businessData?.pickUp?.pickUpTimes;
  let futureDays = businessData?.pickUp?.futureDays;
  let timeZone = businessData?.pickUp?.address?.timeZone;
  const handleOrderPickUp = (pickUp) => {
    dispatch(setOrderPickUp(pickUp));
  };

  const handleDayChange = (dateString) => { // Date in format YYYY.MM.DD 2021.01.01
    const selectedDate = new Date(dateString);
    const dayName = getDayNameByIndex(selectedDate.getDay());
    let opts = updateTimeOptions(dateString);
    setTimeOptions(opts);
    handleOrderPickUp({
      ...orderPickUp,
      time: opts && opts.length > 0 ? opts[0].value : null,
      date: dateString,
      day: dayName,
    });
  };
  const handleTimeChange = (value) => {
    handleOrderPickUp({
      ...orderPickUp,
      time: value
    });
  };

  const updateTimeOptions = (dateValue) => {
    if (pickUpTimes) {
      let tmpOpts = [];
      pickUpTimes.forEach(({ hour, minute }) => {
        let timeValue = getTimeString(hour, minute, dateValue, timeZone);
        if (timeValue) {
          tmpOpts.push(timeValue);
        }
      });

      return tmpOpts;
    }
  };
  useEffect(() => {
    if (futureDays && futureDays.length) {
      setDayOptions([
        ...futureDays
          .filter(({ status }) => status === 'AVAILABLE')
          .map(({ displayText, dayOfWeek, year, month, day }) => {
            return { value: dayOfWeek.toLowerCase(), label: displayText, year, month, day };
          })
      ]);
      if (!timeOptions.length && orderPickUp.date) {
        setTimeOptions(updateTimeOptions(orderPickUp.date));
      }
    }
  }, [businessData]);

  useEffect(() => {
    if (dayOptions.length && !orderPickUp.date) {
      const today = dayOptions.filter((d) => d.label === 'Today')[0];
      if (today && updateTimeOptions(today.value).length) {
        handleDayChange(formatDeliveryDate(today));
      }
    }
  }, [dayOptions]);

  return [orderPickUp, dayOptions, timeOptions, handleTimeChange, handleDayChange];
};
