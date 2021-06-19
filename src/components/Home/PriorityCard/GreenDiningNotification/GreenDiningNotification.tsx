import React from 'react';

import { useGreenDining } from '../../../../hooks/green-dining/useGreenDining';

import { Button, Alert } from 'antd';
import { Card } from '../../../Shared/Card/Card';

// TOOD: add css modules
// import styles from './GreenDiningNotification.css';
import './GreenDiningNotification.css';

export const GreenDiningNotification: React.FC = () => {
  const {
    selectedCount,
    greenDiningInfo,
    loading,
    handleBuyClick,
    handleMore,
    handleLess,
    errorMessage,
    resetError,
  } = useGreenDining();


  if (!greenDiningInfo) {
    return null;
  }

  return (
    <Card className="green-dining-notification">
      <img src={greenDiningInfo.discountMetaData.imageURL} alt="green dining info" />
      <div className="green-dining-notification__form-wrapper">
        <div className="green-dining-notification__counter">
          <span className="green-dining-notification__arrow-up" onClick={handleMore} />
          <input type="text" readOnly value={selectedCount} />
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

      {errorMessage && <Alert key="greenDiningBookError" type="error" message={errorMessage} closable onClose={resetError} />}
    </Card>
  )
}