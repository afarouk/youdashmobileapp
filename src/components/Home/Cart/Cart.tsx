import React from 'react';

import { ROUTE_NAME, useRouting } from '../../../hooks/useRouting';

import { Button } from 'antd';
import { ShoppingCartIcon } from '../../Shared/Icons/Icons'

import './Cart.css';

type Props = {
  itemsCount: number,
  price: number,
}

export const Cart: React.FC<Props> = ({ itemsCount, price }) => {
  const { goTo } = useRouting();

  const handleOrderDetails = () => goTo({ routeName: ROUTE_NAME.CART });

  return (
    <div className="footer-fixed-cart p-default">
      <Button type="primary" size="large" block className="flex" onClick={handleOrderDetails}>
        <span className="footer-fixed-cart-items font-size-lg">{itemsCount} item(s) in cart</span>
        <span className="footer-fixed-cart-icon-container">
          <ShoppingCartIcon className="footer-fixed-cart-icon" />
        </span>
        <span className="footer-fixed-cart-price font-size-lg">${price.toFixed(2)}</span>
      </Button>
    </div>
  );
};
