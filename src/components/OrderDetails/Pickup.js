import React from 'react';
import PropTypes from 'prop-types';
import { Alert } from 'antd';
import { formatAddress } from '../../utils/helpers';
import { PickUpSelectors } from '../Shared/PickUpSelectors/PickUpSelectors';
import { Card } from '../Shared/Card/Card';

export const Pickup = ({ address, saslName, businessData, user, orderPickUp }) => {
  return (
    <Card className="pickup-details">
      <h4 className="font-size-lg primary-text">Pickup</h4>
      <h5 className="flex">
        <span>From</span>
        <span>{saslName}</span>
      </h5>
      <h5 className="flex">
        <span>Time</span>
        {/*<span>{orderPickUp && `${orderPickUp.day} ${orderPickUp.time}`}</span>*/}
        <span className="">
          <div className={'pickup-details_selectors'} id={'pickup-selectors'}>
            <PickUpSelectors user={user} businessData={businessData} />
          </div>
          <div>
            {(!orderPickUp.date || !orderPickUp.time) && (
              <Alert message="Select day and time" type="warning" showIcon />
            )}
          </div>
        </span>
      </h5>

      <h5 className="flex order-details__pickup-location">
        <span>Address</span>
        <span className="pickup-address bg-secondary">{formatAddress(address)}</span>
      </h5>
    </Card>
  );
};

Pickup.propTypes = {
  saslName: PropTypes.string,
  address: PropTypes.object
};
