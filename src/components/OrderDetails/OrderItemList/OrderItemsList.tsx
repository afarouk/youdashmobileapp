import React from 'react';

import { OrderItem } from '../OrderItem/OrderItem';
import '../OrderItem/OrderItem.css';

type Props = {
  items: any[],
  onDeleteItem?: (index: number) => void,
  onEditItem: (index: number) => void,
}

export const OrderItemsList: React.FC<Props> = ({ 
  items, 
  onDeleteItem, 
  onEditItem 
}) => {

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
