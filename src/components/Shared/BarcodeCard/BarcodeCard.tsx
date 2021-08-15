import React from 'react';
import Barcode from 'react-barcode';

import { Card } from '../Card/Card';

import './BarcodeCard.css';

type Props = {
  value: string,
  className?: string,
}

export const BarcodeCard: React.VFC<Props> = ({ value, className = '' }) => {
  return (
    <Card className={`barcode-card ${className}`}>
      <Barcode value={value} format="CODE128" background="#faf9ff" />
    </Card>
  )
}