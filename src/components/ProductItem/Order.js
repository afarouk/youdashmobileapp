import React from 'react';
import PropTypes from 'prop-types';
import { Alert, Button } from 'antd';
import { ShareIcon } from '../Shared/Icons/Icons';
import useNativeShare from "../../hooks/useNativeShare";

export const Order = ({
  quantity,
  onQtyMinus,
  onQtyPlus,
  addToCart,
  isShoppingCart,
  preventOrdering
}) => {
  const [onShare] = useNativeShare();

  return (
    <div className="product-order">
      <div className="flex product-order__row">
        <Button
          shape="circle"
          onClick={() => onShare()}
          className="product-order__share-btn font-size-md"
        >
          <ShareIcon />
        </Button>
        <div className="product-order-counter">
          <span className="product-order-counter-label font-size-sm">Quantity</span>
          <Button type="primary" shape="round" onClick={onQtyMinus} >
            -
          </Button>
          <span className="primary-text product-order-counter-quantity">{quantity}</span>
          <Button type="primary" shape="round" onClick={onQtyPlus}>
            +
          </Button>
        </div>
      </div>
      {preventOrdering && (
        <Alert message="Business doesn't accept orders at this moment." type="warning" showIcon />
      )}
      <Button
        className="font-size-md"
        type="primary"
        block
        size="large"
        disabled={!quantity || preventOrdering}
        onClick={addToCart}
      >
        {!isShoppingCart ? 'Add to cart' : 'Apply changes'}
      </Button>
    </div>
  );
};

Order.propTypes = {
  quantity: PropTypes.number,
  onQtyPlus: PropTypes.func.isRequired,
  onQtyMinus: PropTypes.func.isRequired,
  addToCart: PropTypes.func.isRequired
};
