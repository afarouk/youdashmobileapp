import { useEffect, useState } from 'react';
import differenceInMinutes from 'date-fns/differenceInMinutes';
import { setOrderPickUp } from '../redux/slices/shoppingCart';
import { useDispatch, useSelector } from 'react-redux';
import {addLeadingZero, changeTimezone, isToday} from '../utils/helpers';

const getTimeString = (hours, minutes, pickUpDay, timeZone) => {
  let date = changeTimezone(new Date(), timeZone);
  date.setHours(+hours);
  date.setMinutes(+minutes);
  let options = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  };
  let dateToCompare = changeTimezone(new Date(), timeZone);
  if (pickUpDay && isToday(pickUpDay.toLowerCase())) {
    // console.log(differenceInMinutes(dateToCompare, date))
    return differenceInMinutes(dateToCompare, date) < 0
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

  const handleDayChange = (value) => {
    let opts = updateTimeOptions(value);
    setTimeOptions(opts);
    handleOrderPickUp({
      ...orderPickUp,
      time: opts && opts.length > 0 ? opts[0].value : null,
      day: value
    });
  };
  const handleTimeChange = (value) => {
    handleOrderPickUp({
      ...orderPickUp,
      time: value
    });
  };

  const updateTimeOptions = (dayValue) => {
    if (pickUpTimes) {
      let tmpOpts = [];
      pickUpTimes.map(({ hour, minute }) => {
        let timeValue = getTimeString(hour, minute, dayValue, timeZone);
        if (timeValue) {
          tmpOpts.push(timeValue);
        }
        return timeValue ? { value: timeValue, label: timeValue } : null;
      });

      return tmpOpts;
    }
  };
  useEffect(() => {
    if (futureDays && futureDays.length) {
      setDayOptions([
        ...futureDays
          .filter(({ status }) => status === 'AVAILABLE')
          .map(({ displayText, dayOfWeek }) => {
            return { value: dayOfWeek.toLowerCase(), label: displayText };
          })
      ]);
      if (!timeOptions.length && orderPickUp.day) {
        setTimeOptions(updateTimeOptions());
      }
    }
  }, [businessData]);

  useEffect(() => {
    if (dayOptions.length && !orderPickUp.day) {
      const today = dayOptions.filter((d) => d.label === 'Today')[0];
      if (today && updateTimeOptions(today.value).length) {
        handleDayChange(today.value);
      }
    }
  }, [dayOptions]);

  return [orderPickUp, dayOptions, timeOptions, handleTimeChange, handleDayChange];
};
