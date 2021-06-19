import React from 'react';

import { Qty } from './Qty';
import { Price } from './Price';
import { Title } from './Title';

import { CloseIcon } from "../../Shared/Icons/Icons";

type Props = {
  itemName: string
  itemOptions: object
  onDeleteItem?: (index: number) => void,
  onEditItem: (index: number) => void,
  index: number,
  quantity: number,
  price: number,
  discountedPrice: number,
  promoCodeTitle: string,
  hasVersions: boolean,
  itemVersion: any,
  itemVersions: any,
}

export const OrderItem: React.FC<Props> = ({
  itemName,
  itemOptions,
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

  const handleEditItem = onEditItem 
    ? () => onEditItem(index)
    : undefined;

  const handleDeleteItem = onDeleteItem 
    ? () => onDeleteItem(index)
    : undefined;

  return (
    <>
      <tr className={hasDiscountedPrice ? 'discounted-price-row-original' : 'default-row'}>
        {onDeleteItem && (
          <td className="order-items-list__item-delete" onClick={handleDeleteItem}>
            <CloseIcon />
          </td>
        )}
        <td className="order-items-list__item" onClick={handleEditItem}>
          <Title
            itemOptions={itemOptions}
            itemName={itemName}
            hasVersions={hasVersions}
            itemVersion={itemVersion}
            itemVersions={itemVersions}
          />
        </td>
        <Qty quantity={quantity} />
        <Price price={+price * +quantity} />
      </tr>
      {hasDiscountedPrice ? (
        <tr className={'discounted-text'}>
          {onDeleteItem && <td className="order-items-list__item-delete" />}
          <td className="order-items-list__item" onClick={handleEditItem}>
            <Title
              itemOptions={itemOptions}
              isPromoCode
              itemName={promoCodeTitle}
              hasVersions={hasVersions}
              itemVersion={itemVersion}
              itemVersions={itemVersions}
            />
          </td>
          <Qty quantity={quantity} />
          <Price price={hasDiscountedPrice ? discountedPrice : +price * +quantity} />
        </tr>
      ) : null}
    </>
  );
};
