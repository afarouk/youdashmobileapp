import React from 'react';

import {getSubItemsString} from "../../../utils/helpers";

type Props = {
  itemName: string,
  hasVersions: boolean,
  itemVersions: any,
  itemVersion: any,
  itemOptions: any,
  isPromoCode?: boolean,
}

export const Title: React.FC<Props> = ({
  itemName,
  hasVersions,
  itemVersions,
  itemVersion,
  itemOptions,
  isPromoCode
}) => (
  <span className={`order-items-list-item__title ${isPromoCode ? ' promo-code-title' : ''}`}>
    <span className="order-items-list-item__name">
      {itemName}
      {hasVersions && itemVersions && itemVersion
        ? `[${itemVersions[itemVersion - 1].version1DisplayText}]`
        : ''}
    </span>
    <span className="order-items-list__item-subitems"> {getSubItemsString(itemOptions)}</span>
  </span>
);

