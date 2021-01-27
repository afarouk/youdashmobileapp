import React from 'react';
import PropTypes from 'prop-types';
import Barcode from 'react-barcode';
import { Card } from '../Shared/Card/Card';

export const OrderBarcode = ({ value }) => (
  <Card id="order-status-barcode" className="order-status__barcode">
    <Barcode value={value} format="CODE128" background="#faf9ff" />
  </Card>
);

OrderBarcode.propTypes = {
  value: PropTypes.string.isRequired
};
