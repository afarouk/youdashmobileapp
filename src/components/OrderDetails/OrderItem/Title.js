import React from 'react';
import PropTypes from 'prop-types';
import {getSubItemsString} from "../../../utils/helpers";

export const Title = ({
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

Title.propTypes = {
  itemName: PropTypes.string,
  hasVersions: PropTypes.bool,
  itemOptions: PropTypes.object
};
