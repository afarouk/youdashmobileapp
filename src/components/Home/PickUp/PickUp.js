import React, { memo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Radio } from 'antd';
import { Link } from 'react-router-dom';

import differenceInMinutes from 'date-fns/differenceInMinutes';

import { addLeadingZero, changeTimezone, formatAddress } from '../../../utils/helpers';
import { PickUpSelectors } from '../../Shared/PickUpSelectors/PickUpSelectors';
import { Card } from '../../Shared/Card/Card';

import keyTagImage from '../../../assets/images/key-tags-3-types.png';
import usePreventOrdering from '../../../hooks/core/usePreventOrdering';
import './PickUp.css';
import {CalendarIcon, LocationOnIcon} from "../../Shared/Icons/Icons";
import {AccessTimeIcon} from "../../Shared/Icons/Icons";
import { useSelector } from '../../../redux/store';
import { ROUTE_NAME, useRouting } from '../../../hooks/useRouting';
import { selectReservationEnabled } from '../../../redux/selectors/reservationSelectors';


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

export const PickUp = memo(({ 
  businessData, 
  user,
  onLoyaltyClick,
}) => {
  const { getRouteUrl } = useRouting();
  const [deliveryType, setDeliveryType] = useState(1);
  const [openStatus, setOpenStatus] = useState('Open');
  const reservationEnabled = useSelector(selectReservationEnabled);
  const reservation = useSelector(state => state.reservation.data);
  const reservationInitialDataLoaded = useSelector(state => state.reservation.initialDataLoaded);
  const handleDeliveryTypeChange = (e) => setDeliveryType(e.target.value);
  const { openingHours } = businessData;
  const { siteMessage, isOpen, address } = businessData.pickUp;

  let timeZone = businessData?.pickUp?.address?.timeZone;
  const [today, setToday] = useState(null);

  const [preventOrdering] = usePreventOrdering(businessData);
  const tableDetails = useSelector(state => state.shoppingCart.tableDetails);

  const hasTable = Boolean(tableDetails && tableDetails.tableId);

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
      setOpenStatus(
        differenceInMinutes(nowDate, openClosingDateTime.open) >= 0 &&
          differenceInMinutes(nowDate, openClosingDateTime.close) <= 0
          ? 'Open'
          : 'Closed'
      );
    }
  }, [openingHours, preventOrdering]);

  const hasReservation = reservation && reservation.entryId;
  const reservationRoute = hasReservation ? ROUTE_NAME.RESERVATION_DETAILS : ROUTE_NAME.RESERVATION;

  return (
    <Card className={'pickup'}>
      {!hasTable && (
        <>
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
        </>
      )}
      
      
      <div className="pickup-line address">
        <span className="primary-text pickup-line__icon">
          <LocationOnIcon />

        </span>
        <span>{formatAddress(address)}</span>
      </div>
      <div className="pickup-line address flex">
        <div className="flex">
          <span className="pickup-line__icon primary-text">
            <AccessTimeIcon />
          </span>
          <span>
            {(openingHours || []).map(({ weekDayPolicies }, i) => {
              return <div key={`openingHours${i}`}>{formatTime(weekDayPolicies[today])}</div>;
            })}
          </span>
        </div>
        <div className="pickup-line__column">
          <span className="pickup-status primary-text">{openStatus}</span>
        </div>
      </div>

      <div className="flex mb-default">
        <div onClick={onLoyaltyClick} className="pickup-line__column cursor-pointer">
          <span className="pickup-line__icon pickup-line__loyalty-icon">
            <img src={keyTagImage} alt="key tag" />
          </span>
          <span className="fw-medium pickup-line__link-text">Loyalty</span>
        </div>

        {reservationEnabled & reservationInitialDataLoaded && (
          <Link to={getRouteUrl(reservationRoute)} className="pickup-line__column">
            <span className="pickup-line__icon primary-text fw-medium">
              <CalendarIcon width="1.4em" height="1.4em" className="pickup__calendar-icon" />  
            </span>
            <span className="fw-medium pickup-line__link-text">
              {hasReservation ? 'Check reservation' : 'Book a table'}
            </span>
          </Link>
        )}
      </div>

      {siteMessage && (
        <div className="pickup-line address">
          <span>{siteMessage}</span>
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
