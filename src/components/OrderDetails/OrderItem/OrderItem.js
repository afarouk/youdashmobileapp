import React from 'react';
import PropTypes from 'prop-types';
import { Title } from './Title';

import { Qty } from './Qty';
import { Price } from './Price';

import {CloseIcon} from "../../Shared/Icons/Icons";

export const OrderItem = ({
  itemName,
  itemOptions,
  businessUrlKey,
  search,
  index,
  quantity,
  price,
  discountedPrice,
  promoCodeTitle,
  hasVersions,
  itemVersion,
  itemVersions,
  onDeleteItem,
  onEditItem
}) => {
  const hasDiscountedPrice = discountedPrice !== undefined; //can't just check if(discountedPrice) below, because it can contain 0 value
  const handleEditItem = () => onEditItem(index);
  const handleDeleteItem = () => onDeleteItem(index);
  return (
    <>
      <tr className={hasDiscountedPrice ? 'discounted-price-row-original' : 'default-row'}>
        <td className="order-items-list__item-delete" onClick={handleDeleteItem}>
          <CloseIcon />
        </td>
        <td className="order-items-list__item" onClick={handleEditItem}>
          <Title
            itemOptions={itemOptions}
            itemName={itemName}
            hasVersions={hasVersions}
            itemVersion={itemVersion}
            itemVersions={itemVersions}
          />
          {/*{!hasDiscountedPrice && (
            <Actions
              index={index}
              businessUrlKey={businessUrlKey}
              onDeleteItem={onDeleteItem}
              search={search}
            />
          )}*/}
        </td>
        <Qty quantity={quantity} />
        <Price price={+price * +quantity} />
      </tr>
      {hasDiscountedPrice ? (
        <tr className={'discounted-text'}>
          <td className="order-items-list__item-delete" onClick={handleDeleteItem} />
          <td className="order-items-list__item" onClick={handleEditItem}>
            <Title
              itemOptions={itemOptions}
              isPromoCode
              itemName={promoCodeTitle}
              hasVersions={hasVersions}
              itemVersion={itemVersion}
              itemVersions={itemVersions}
            />
            {/*<Actions
              index={index}
              businessUrlKey={businessUrlKey}
              onDeleteItem={onDeleteItem}
              search={search}
            />*/}
          </td>
          {/*<PromoCode code={promoCodeTitle} />*/}
          <Qty quantity={quantity} />
          <Price price={hasDiscountedPrice ? discountedPrice : +price * +quantity} />
        </tr>
      ) : null}
    </>
  );
};

OrderItem.propTypes = {
  //myProp: PropTypes.string.isRequired,
  itemName: PropTypes.string.isRequired,
  itemOptions: PropTypes.object,
  businessUrlKey: PropTypes.string.isRequired,
  onDeleteItem: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  quantity: PropTypes.number.isRequired,
  price: PropTypes.number.isRequired
};
