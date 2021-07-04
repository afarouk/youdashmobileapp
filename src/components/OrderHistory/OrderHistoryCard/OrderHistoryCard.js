import React from 'react';
import PropTypes from 'prop-types';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import './OrderHistoryCard.css';
import { Button } from 'antd';

import { Card } from '../../Shared/Card/Card';
import useNativeShare from '../../../hooks/useNativeShare';
import {ShareIcon, InfoCircleIcon, ArrowRepeatIcon} from '../../Shared/Icons/Icons';

export const OrderHistoryCard = ({
  id,
  title,
  price,
  items,
  status,
  date,
  orderUUID,
  orderNumber,
  dateTimeOrderPlacedOn,
  onReOrder
}) => {
  const shareData = {
    title: 'YouDash French Bakery',
    text: 'YouDash French Bakery - the best bakery in the world!',
    url: 'https://youdash.co/french-bakery'
  };

  let history = useHistory();
  const { search } = useLocation();
  let { businessUrlKey } = useParams();
  const [onShare] = useNativeShare();

  const handleOrderStatus = () => {
    history.push(`/${businessUrlKey}/order-status/${orderUUID}${search}`);
  }
    
  const handleShare = () => onShare();
  const handleReOrder = () => onReOrder(items);

  return (
    <Card className="order-history-card">
      {/*<h4 className="flex primary-text">
        <span>{title}</span>
        <span>${price}</span>
      </h4>*/}
      <div className="flex orders">
        <ul>
          {(items || []).map(({ itemName, quantity }, i) => (
            <li key={`product-list-item${orderUUID + i}`}>
              {itemName} x{quantity}
            </li>
          ))}
        </ul>
        {/* <Button icon={<InfoCircleIcon />} onClick={handleOrderStatus} type="primary">
          Status
        </Button> */}
        {/* {orderStatus && (
          <div className={`flex status status-${status}`}>
            <span className="status-title">{orderStatus.title}</span>
            {orderStatus.icon}
          </div>
        )}*/}
      </div>
      <div className="share-order flex">
        <Button icon={<ShareIcon />} onClick={handleShare}>
          Share
        </Button>
        <Button icon={<ArrowRepeatIcon />} onClick={handleReOrder} type="primary">
          Add all to cart
        </Button>
      </div>
      <div className="flex order-history-card-footer font-size-sm">
        <span>{dateTimeOrderPlacedOn}</span>
        {orderNumber && <span>#{orderNumber}</span>}
      </div>
    </Card>
  );
};

OrderHistoryCard.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  title: PropTypes.string,
  price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  items: PropTypes.array,
  status: PropTypes.string,
  date: PropTypes.string,
  orderNumber: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};
