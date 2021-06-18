import { useEffect, useState } from 'react';
import differenceInMinutes from 'date-fns/differenceInMinutes';
import { setOrderPickUp } from '../redux/slices/shoppingCart';
import { useDispatch } from 'react-redux';
import {addLeadingZero, changeTimezone, formatDeliveryDate, isToday, getDayNameByIndex } from '../utils/helpers';
import { BusinessData, PICK_UP_DAY_STATUS } from '../types/businessData';
import { useSelector } from '../redux/store';

type TimeValue = {
  label: string,
  value: string,
}

const getTimeValue = (hours: number, minutes: number, pickupDate: string, timeZone: string): TimeValue | null => {
  let date = changeTimezone(new Date(), timeZone);
  date.setHours(+hours);
  date.setMinutes(+minutes);
  let options: any = {
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

export default (businessData: BusinessData) => {
  const [dayOptions, setDayOptions] = useState<any[]>([]);
  const [timeOptions, setTimeOptions] = useState<any[]>([]);
  let dispatch = useDispatch();
  const orderPickUp = useSelector((state) => state.shoppingCart.orderPickUp);

  let dayPickUpTimes = businessData.pickUp.dayPickUpTimes;
  let timeZone: any = businessData?.pickUp?.address?.timeZone;
  const handleOrderPickUp = (pickUp: any) => {
    dispatch(setOrderPickUp(pickUp));
  };

  const handleDayChange = (dateString: string) => { // Date in format YYYY.MM.DD 2021.01.01
    const selectedDate = new Date(dateString);
    const dayName = getDayNameByIndex(selectedDate.getDay());
    let opts: any = getTimeOptions(dateString);
    setTimeOptions(opts);
    handleOrderPickUp({
      ...orderPickUp,
      time: opts && opts.length > 0 ? opts[0].value : null,
      date: dateString,
      day: dayName,
    });
  };
  const handleTimeChange = (value: any) => {
    handleOrderPickUp({
      ...orderPickUp,
      time: value
    });
  };


  const getTimeOptions = (dateValue: string): TimeValue[] => {
    const tmpOpts: TimeValue[] = [];

    const pickUpTimes = dayPickUpTimes.find(t => t.day.date === dateValue);

    if (pickUpTimes) {
      pickUpTimes.times.forEach(({ hour, minute }) => {
        let timeValue = getTimeValue(hour, minute, dateValue, timeZone);
        if (timeValue) {
          tmpOpts.push(timeValue);
        }
      });
    }

    return tmpOpts;
  };
  useEffect(() => {
    if (dayPickUpTimes.length) {
      const dayOptions = dayPickUpTimes
        .filter(({ day }) => day.status === PICK_UP_DAY_STATUS.AVAILABLE)
        .map(({ day }) => ({
          value: day.dayOfWeek.toLowerCase(),
          label: day.displayText,
          year: day.year, 
          month: day.month, 
          day: day.day,
          date: day.date,
        }))
      setDayOptions(dayOptions);
    }
  }, [businessData]);

  useEffect(() => {
    if (dayOptions.length && !orderPickUp.date) {
      const today = dayOptions.find((d) => d.label === 'Today');
      if (today && getTimeOptions(today.date).length) {
        handleDayChange(formatDeliveryDate(today));
      }
    }
  }, [dayOptions]);

  useEffect(() => {
    if (dayPickUpTimes.length && orderPickUp && orderPickUp.date) {
      setTimeOptions(getTimeOptions(orderPickUp.date));
    }
  }, [])

  return [orderPickUp, dayOptions, timeOptions, handleTimeChange, handleDayChange];
};
