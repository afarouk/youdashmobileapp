import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import { Card } from '../../Shared/Card/Card';

export const MyPastOrders = memo(({ urlKey }) => {
  const { search } = useLocation();
  return (
    <Card>
      <Link to={`/${urlKey}/order-history${search}`}>
        <h4 className="font-size-lg">My Past Orders</h4>
      </Link>
    </Card>
  );
});

MyPastOrders.propTypes = {
  urlKey: PropTypes.string.isRequired
};
