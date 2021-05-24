import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import './Cart.css';

export const Cart = ({ itemsCount, price }) => {
  let history = useHistory();
  const { search } = useLocation();
  let { businessUrlKey } = useParams();
  const handleOrderDetails = () => history.push(`/${businessUrlKey}/order-details${search}`);
  return (
    <div className="footer-fixed-cart p-default">
      <Button type="primary" size="large" block className="flex" onClick={handleOrderDetails}>
        <span className="footer-fixed-cart-items font-size-lg">{itemsCount} items in cart</span>
        <span className="footer-fixed-cart-price font-size-lg">${price.toFixed(2)}</span>
      </Button>
    </div>
  );
};

Cart.propTypes = {
  itemsCount: PropTypes.number,
  price: PropTypes.number
};
