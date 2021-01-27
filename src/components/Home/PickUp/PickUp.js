import React, { memo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Radio } from 'antd';

import differenceInMinutes from 'date-fns/differenceInMinutes';

import { addLeadingZero, changeTimezone, formatAddress } from '../../../utils/helpers';
import { PickUpSelectors } from '../../Shared/PickUpSelectors/PickUpSelectors';
import { Card } from '../../Shared/Card/Card';

import usePreventOrdering from '../../../hooks/core/usePreventOrdering';
import './PickUp.css';
import {LocationOnIcon} from "../../Shared/Icons/Icons";
import {AccessTimeIcon} from "../../Shared/Icons/Icons";


const getDay = () => ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][new Date().getDay()];
const formatTime = (weekDayPolicy) => {
  let startMin = weekDayPolicy?.timeRange?.openingHours?.startClock.minute;
  let endMin = weekDayPolicy?.timeRange?.openingHours?.endClock.minute;
  startMin = addLeadingZero(startMin);
  endMin = addLeadingZero(endMin);
  return `${weekDayPolicy?.timeRange?.openingHours?.startClock.hour}:${startMin} to
      ${weekDayPolicy?.timeRange?.openingHours?.endClock.hour}:${endMin}
      `;
};
const getOpenClosingDateTime = (weekDayPolicy, timezone) => {
  let closingDate = changeTimezone(new Date(), timezone);
  let openDate = changeTimezone(new Date(), timezone);
  closingDate.setHours(+weekDayPolicy?.timeRange?.openingHours?.endClock.hour);
  closingDate.setMinutes(+weekDayPolicy?.timeRange?.openingHours?.endClock.minute);
  openDate.setHours(+weekDayPolicy?.timeRange?.openingHours?.startClock.hour);
  openDate.setMinutes(+weekDayPolicy?.timeRange?.openingHours?.startClock.minute);
  return {
    close: closingDate,
    open: openDate
  };
};
export const PickUp = memo(({ businessData, user }) => {
  const [deliveryType, setDeliveryType] = useState(1);
  const [openStatus, setOpenStatus] = useState('Open');
  const handleDeliveryTypeChange = (e) => setDeliveryType(e.target.value);
  const { openingHours } = businessData;
  const { isOpenWarningMessage, isOpen, address } = businessData.pickUp;

  let timeZone = businessData?.pickUp?.address?.timeZone;
  const [today, setToday] = useState(null);

  const [preventOrdering] = usePreventOrdering(businessData);

  useEffect(() => {
    if (openingHours) {
      setToday(getDay());
    }
    if (preventOrdering) {
      return setOpenStatus('Closed');
    }
    let openClosingDateTime = null;
    (openingHours || []).map(({ weekDayPolicies }, i) => {
      if (weekDayPolicies[getDay()]) {
        openClosingDateTime = getOpenClosingDateTime(weekDayPolicies[getDay()], timeZone);
      }
    });

    if (openClosingDateTime) {
      let nowDate = changeTimezone(new Date(), timeZone);
      /* nowDate.setHours(20);
        nowDate.setMinutes(0);*/
      /* console.log(nowDate);
      console.log(openClosingDateTime);
      console.log(differenceInMinutes(nowDate, openClosingDateTime.open));
      console.log(differenceInMinutes(nowDate, openClosingDateTime.close));*/
      setOpenStatus(
        differenceInMinutes(nowDate, openClosingDateTime.open) >= 0 &&
          differenceInMinutes(nowDate, openClosingDateTime.close) <= 0
          ? 'Open'
          : 'Closed'
      );
    }
  }, [openingHours, preventOrdering]);

  return (
    <Card className={'pickup'}>
      <Radio.Group
        onChange={handleDeliveryTypeChange}
        value={deliveryType}
        className={'pickup-line delivery-type'}
      >
        <Radio value={1}>PickUp</Radio>
        <Radio value={2} disabled>
          Delivery
        </Radio>
      </Radio.Group>
      <div className="pickup-line selectors">
        <PickUpSelectors user={user} businessData={businessData} />
      </div>
      <div className="pickup-line address">
        <span className="primary-text">
          <LocationOnIcon />

        </span>
        <span>{formatAddress(address)}</span>
      </div>
      <div className="pickup-line address">
        <span className="primary-text">
          <AccessTimeIcon />
        </span>
        <span>
          {(openingHours || []).map(({ weekDayPolicies }, i) => {
            return <div key={`openingHours${i}`}>{formatTime(weekDayPolicies[today])}</div>;
          })}
        </span>
        <span className="pickup-status primary-text">{openStatus}</span>
      </div>
      {isOpenWarningMessage && (
        <div className="pickup-line address">
          <span>{isOpenWarningMessage}</span>
        </div>
      )}
    </Card>
  );
});

PickUp.propTypes = {
  address: PropTypes.object,
  timeOpen: PropTypes.string,
  timeClose: PropTypes.string,
  status: PropTypes.string
};
