import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Input, Button } from 'antd';
import { OrderHistoryCard } from './OrderHistoryCard/OrderHistoryCard';
import { RefreshIcon, SearchIcon } from '../Shared/Icons/Icons';
import './OrderHistory.css';
export const OrderHistory = ({ orders, onReOrder, onReloadHistory, loading }) => {
  const [searchString, setSearchString] = useState('');
  const handleSearch = (e) => setSearchString(e.target.value);

  return (
    <div className="p-default order-history">
      <h3 className="font-size-lg flex">
        <span>Search order</span>
        <Button type="primary" icon={<RefreshIcon />} loading={loading} onClick={onReloadHistory} />
      </h3>
      <Input
        value={searchString}
        onChange={handleSearch}
        size="large"
        placeholder="Search order by name"
        prefix={<SearchIcon />}
        className="card bg-secondary"
      />
      {(searchString.length > 1 && orders
        ? orders.filter(
            (o) =>
              o.items.filter(
                (i) => i.itemName.toLowerCase().indexOf(searchString.toLowerCase()) !== -1
              ).length
          )
        : orders || []
      ).map((order, i) => (
        <OrderHistoryCard {...order} onReOrder={onReOrder} key={`orderHistory${i}`} />
      ))}
    </div>
  );
};

OrderHistory.propTypes = {
  orders: PropTypes.array
};
