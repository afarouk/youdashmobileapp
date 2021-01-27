import React from 'react';
import PropTypes from 'prop-types';
import { Card } from '../Shared/Card/Card';

export const Prize = ({ prize }) => {
  const { contestPrizeName } = prize;
  return (
    <Card className="poll__prize">
      <div className='poll__prize-text'>
        <p className="primary-text poll__prize-chance-to-win">CHANCE TO WIN</p>
        <h4 className='font-size-lg'>{contestPrizeName}</h4>
          <p className='poll__prize-terms font-size-xs'>* Terms and Conditions Apply</p>
      </div>
        <div className='poll__prize-image'>
            <img src={prize.imageURL} alt=""/>
        </div>
    </Card>
  );
};

Prize.propTypes = {
  //myProp: PropTypes.string.isRequired
};
