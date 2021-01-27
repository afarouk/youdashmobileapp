import React from 'react';
import PropTypes from 'prop-types';
import trackOrderImage from '../../assets/images/track-order-guy.png';
import { Timeline } from 'antd';
import { Card } from '../Shared/Card/Card';

export const OrderTimeLine = ({ orderStatus, mobileOrderStatuses }) => (
  <Card>
    <h4 className="font-size-md">Track order</h4>
    <div className="flex order-status__timeline p-default">
      <img src={trackOrderImage} alt="" />
      <Timeline>
        {Object.keys(mobileOrderStatuses).map((key, i) => (
          <Timeline.Item color={`${orderStatus.enumText === key ? 'blue' : 'grey'}`} key={`timeline${i}`}>
            <span className={`${orderStatus.enumText === key ? 'active-label' : ''}`}>
              {mobileOrderStatuses[key]}
            </span>
          </Timeline.Item>
        ))}
      </Timeline>
    </div>
  </Card>
);

OrderTimeLine.propTypes = {
  orderStatus: PropTypes.object
};
