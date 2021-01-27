import React from 'react';
import PropTypes from 'prop-types';
import { Card } from '../../../Shared/Card/Card';
import { ProductCard } from '../../Groups/ProductCard/ProductCard';
import './HighlightedItem.css';
export const HighlightedItem = ({ item, message }) => (
  <Card>
    {message && <h4 className="primary-text font-size-lg highlighted-item__message">{message}</h4>}
    <div className="highlighted-item__card">
      <ProductCard product={item} isCard={false} />
    </div>
  </Card>
);

HighlightedItem.propTypes = {
  item: PropTypes.object.isRequired,
  message: PropTypes.string
};
