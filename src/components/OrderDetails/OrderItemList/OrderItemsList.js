import React from 'react';
import PropTypes from 'prop-types';
import { useLocation, useParams } from 'react-router-dom';
import { OrderItem } from '../OrderItem/OrderItem';
import '../OrderItem/OrderItem.css';
export const OrderItemsList = ({ items, onDeleteItem, onEditItem }) => {
  const { businessUrlKey } = useParams();
  const { search } = useLocation();

  return (
    <div className="bg-secondary order-items-list">
      <h4 className="font-size-lg primary-text">Items ({items.length})</h4>
      <table className="order-items-list-table">
        <tbody>
          {(items || []).map((item, i) => {
            return (
              <OrderItem
                {...item}
                index={i}
                key={`orderProductItem${i}`}
                businessUrlKey={businessUrlKey}
                search={search}
                onDeleteItem={onDeleteItem}
                onEditItem={onEditItem}
              />
            );
          })}
        </tbody>
      </table>
      {!items.length && <h5>Shopping cart is empty</h5>}
    </div>
  );
};

OrderItemsList.propTypes = {
  items: PropTypes.array.isRequired,
  onDeleteItem: PropTypes.func.isRequired
};
