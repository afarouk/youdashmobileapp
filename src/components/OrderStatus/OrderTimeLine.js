import React from 'react';
import PropTypes, { string } from 'prop-types';
import trackOrderImage from '../../assets/images/track-order-guy.png';
import { Timeline } from 'antd';
import { Card } from '../Shared/Card/Card';

import { ORDER_STATUS_LABELS, ORDER_STATUS } from '../../config/constants';

import './OrderTimeLine.css';

export const OrderTimeLine = ({ orderStatus }) => {
  const timelineOrderStatuses = Object.keys(ORDER_STATUS_LABELS).filter((status) => {
    return status !== ORDER_STATUS.ARCHIVED && status !== ORDER_STATUS.UNDEFINED;
  })
  return (
    <Card>
      <h4 className="font-size-md">Track order</h4>
      <div className="flex order-status__timeline p-default">
        <img src={trackOrderImage} alt="" />
        <Timeline>
          {timelineOrderStatuses.map((key, i) => {
            const isActiveStatus = orderStatus === key;
            return (
              <Timeline.Item 
                color={isActiveStatus ? 'blue' : 'grey'} 
                key={`timeline${i}`} 
                className={isActiveStatus ? 'order-timeline__item--active' : ''}
              >
                <span className={`${orderStatus === key ? 'active-label' : ''}`}>
                  {ORDER_STATUS_LABELS[key]}
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
