import React from 'react';
import PropTypes from 'prop-types';
// import drivingDirectionsImage from '../../assets/images/drive.png';
import { Button } from 'antd';
import { Card } from '../Shared/Card/Card';
import { googleMapAPIKey } from '../../config/constants';

export const Directions = ({ lat, lng, address, isDemo, saslName }) => {
  let iFrameParams = ``;
  if (address && address.indexOf('undefined') === -1) {
    iFrameParams = `${isDemo && saslName ? `${saslName}+` : ''}${address}`;
  } else if (lat && lng) {
    iFrameParams = `${lat},${lng}`;
  }

  return (
    <Card className={'order-status__directions'}>
      <h4 className="font-size-md">For driving directions click below</h4>
      {/*<img src={drivingDirectionsImage} alt="directions" />*/}
      <iframe
        width="100%"
        height="300"
        frameBorder="0"
        src={`https://www.google.com/maps/embed/v1/place?q=${iFrameParams}&key=${googleMapAPIKey}`}
      />
      <a
        className={'ant-btn ant-btn-block'}
        target="_blank"
        href={`https://www.google.com/maps?daddr=${lat},${lng}`}
      >
        Directions
      </a>
    </Card>
  );
};
Directions.propTypes = {
  lat: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  lng: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};
