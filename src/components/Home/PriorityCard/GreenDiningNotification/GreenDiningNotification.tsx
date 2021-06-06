import React, { MouseEventHandler, useState } from 'react';
import { useDispatch } from 'react-redux';

import { useSelector } from '../../../../redux/store';
import { blockGreenDiningOrder } from '../../../../redux/slices/greenDiningSlice';

import { Button } from 'antd';
import { Card } from '../../../Shared/Card/Card';
import { GREEN_DINING_BLOCK_DURATION_SEC } from '../../../../config/constants';

// TOOD: add css modules
// import styles from './GreenDiningNotification.css';
import './GreenDiningNotification.css';

export const GreenDiningNotification: React.FC = () => {
  const dispatch = useDispatch();
  const [count, setCount] = useState(1);

  const greenDiningInfo = useSelector(state => state.greenDining.data);
  const loading = useSelector(state => state.greenDining.blockOrderLoading);
  const error = useSelector(state => state.greenDining.blockOrderError);

  const serviceAccommodatorId: any = useSelector(state => state.business.data.serviceAccommodatorId);
  const serviceLocationId: any = useSelector(state => state.business.data.serviceLocationId);

  const souuid = useSelector(state => state.greenDining.souuid);
  const discountUUID = useSelector(state => state.greenDining.discountUUID);


  // const maxCount = greenDiningInfo.lastAvailableCount

  const handleBuyClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault();

    // TODO: redirect to checkout
    dispatch(blockGreenDiningOrder({
      blockCount: 1, // TODO:,
      blockDurationSeconds: GREEN_DINING_BLOCK_DURATION_SEC,
      // TOOD: move these parameters to action if it's possible
      discountUUID,
      serviceAccommodatorId,
      serviceLocationId,
      souuid,
    }))
  }


  if (!greenDiningInfo) {
    return null;
  }

  const handleMore = () => {
    if (count < greenDiningInfo.lastAvailableCount) {
      setCount(prevCount => prevCount + 1);
    }
  }

  const handleLess = () => {
    if (count > 1) {
      setCount(prevCount => prevCount - 1);
    }
  }

  // TODO: add close button and do history replace state on close 
  // TODO: try to use modal
  return (
    <Card className="green-dining-notification">
      <img src={greenDiningInfo.discountMetaData.imageURL} alt="green dining info" />
      <div className="green-dining-notification__form-wrapper">
        <div className="green-dining-notification__counter">
          <span className="green-dining-notification__arrow-up" onClick={handleMore} />
          <input type="text" readOnly value={count} />
          <span className="green-dining-notification__arrow-down" onClick={handleLess} />
        </div>
        <Button
          className="font-size-md green-dining-notification__buy-button"
          type="primary"
          // block
          size="large"
          disabled={loading}
          onClick={handleBuyClick}
          htmlType="button"
        >
          Buy
        </Button>
      </div>
    </Card>
  )
}