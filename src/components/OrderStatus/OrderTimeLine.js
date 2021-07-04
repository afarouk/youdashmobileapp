import React from 'react';
import PropTypes, { string } from 'prop-types';
import trackOrderImage from '../../assets/images/track-order-guy.png';
import { Timeline } from 'antd';
import { Card } from '../Shared/Card/Card';

import { ORDER_STATUS_CONFIG, ORDER_STATUS } from '../../config/constants';

import './OrderTimeLine.css';

export const OrderTimeLine = ({ orderStatus }) => {
  const timelineOrderStatuses = Object.keys(ORDER_STATUS_CONFIG);
  const activeStatusIndex = timelineOrderStatuses.findIndex(status => orderStatus === status);

  return (
    <Card>
      <h4 className="font-size-md">Track order</h4>
      <div className="flex order-status__timeline p-default">
        <img src={trackOrderImage} alt="" />
        <Timeline>
          {timelineOrderStatuses.map((key, i) => {
            const isActiveStatus = orderStatus === key;
            const isPastStatus = activeStatusIndex > i;
            const isFutureStatus = activeStatusIndex < i;
            const statusConfig = ORDER_STATUS_CONFIG[key];

            const className = [
              'order-timeline__item',
              isPastStatus && 'order-timeline__item--past',
              isActiveStatus && 'order-timeline__item--active',
              isFutureStatus && 'order-timeline__item--future',
            ].filter(Boolean).join(' ');

            const imgSrc = [
              isPastStatus && statusConfig.icons.past,
              isActiveStatus && statusConfig.icons.current,
              isFutureStatus && statusConfig.icons.future,
            ].filter(Boolean)[0];

            return (
              <Timeline.Item 
                key={`timeline${i}`} 
                className={className}
                dot={
                  <img 
                    src={imgSrc} 
                    alt="status icon" 
                    className="order-timeline__item-icon" 
                  />}
              >
                <span className={`${orderStatus === key ? 'active-label' : ''}`}>
                  {statusConfig.label}
                </span>
              </Timeline.Item>
            )
          })}
        </Timeline>
      </div>
    </Card>
  );
}

OrderTimeLine.propTypes = {
  orderStatus: string,
};
