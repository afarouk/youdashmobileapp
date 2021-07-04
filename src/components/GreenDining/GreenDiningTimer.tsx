import React from 'react';
import { Modal } from 'antd';

import { GREEN_DINING_BLOCK_DURATION_SEC } from '../../config/constants';
import { useSelector } from '../../redux/store';
import { useGreenDiningCancel } from '../../hooks/green-dining/useGreenDiningCancel';

import { Timer } from '../Shared/Timer';
import { useEffect } from 'react';
import { useBeforeUnload } from '../../hooks/useBeforeUnload';

export const GreenDiningTimer = () => {
  const { cancelGreenDining, sendBackendCancellation } = useGreenDiningCancel();
  const greenDiningStartedAt = useSelector(state => state.greenDining.startedAt);
  
  useBeforeUnload({ callback: sendBackendCancellation });

  useEffect(() => {
    const handlePopState = () => {
      cancelGreenDining();
    }
    
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [])

  const handleGreenDiningExpire = () => {
    sendBackendCancellation();

    Modal.info({
      title: 'Session Expired',
      onOk: cancelGreenDining,
      centered: true,
    })
  }

  if (!greenDiningStartedAt) {
    return null;
  }

  return (
    <Timer 
      startDate={greenDiningStartedAt} 
      durationS={GREEN_DINING_BLOCK_DURATION_SEC}  
      onExpire={handleGreenDiningExpire}
    />
  )
}