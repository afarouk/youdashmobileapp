import React from 'react';

import { useGreenDining } from '../../../../hooks/green-dining/useGreenDining';

import { Button, Alert, Modal } from 'antd';
import { Card } from '../../../Shared/Card/Card';

// TOOD: add css modules
// import styles from './GreenDiningNotification.css';
import './GreenDiningNotification.css';
import { useGreenDiningCancel } from '../../../../hooks/green-dining/useGreenDiningCancel';

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
    pickUpTime,
  } = useGreenDining();

  const { cancelGreenDining } = useGreenDiningCancel();

  if (!greenDiningInfo || greenDiningInfo.lastAvailableCount < 1) {
    return null;
  }

  return (
    <Modal
      centered
      visible
      onCancel={cancelGreenDining}
      footer={null}
      bodyStyle={{ padding: 0 }}
      style={{ borderRadius: '6px' }}
      wrapClassName="green-dining-notification-modal"
      maskClosable={false}
    >
      <Card className="green-dining-notification">
        <img src={greenDiningInfo.discountMetaData.imageURL} alt="green dining info" />
        <p className="green-dining-notification__pickup">Buy and pick up <strong>{greenDiningInfo.pickupDayTime.day.displayText}</strong> by <strong>{pickUpTime}</strong></p>
        <div className="green-dining-notification__form-wrapper">
          <Button
            className="font-size-md green-dining-notification__buy-button"
            type="default"
            size="large"
            onClick={cancelGreenDining}
            htmlType="button"
          >
            Close
          </Button>
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
    </Modal>
  )
}