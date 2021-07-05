import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addCartItem, addDiscount, addGroupDiscount } from '../../redux/slices/shoppingCart';
import { message } from 'antd';
import { transformLoyaltyToDiscount, transformPromotionToDiscount } from '../../utils/helpers';
import { discountTypes, DISCOUNT_QUERY_PARAMETER_NAME, DISCOUNT_QUERY_PARAMETER_VALUE, DISCOUNT_UUID_QUERY_PARAMETER_NAME } from '../../config/constants';

export default (businessData) => {
  const { search } = useLocation();
  const dispatch = useDispatch();
  const allDiscounts = useSelector((state) => state.shoppingCart.discounts.byId);
  const loyaltyAndOrderHistory = useSelector((state) => state.loyaltyAndOrderHistory.data);
  
  const handleDiscount = (uuid, discountItem, discountType, addItemToCart = true) => {
    const { applicableItemUUID, applicableGroup } = discountItem;
    const { itemsById } = businessData;

    if (
      discountItem && 
      !applicableGroup && 
      [discountTypes.DISCOUNT, discountTypes.LOYALTY_STATUS].includes(discountType) 
    ) {
      dispatch(
        addDiscount({
          id: uuid,
          discount: {
            ...discountItem,
            discountType
          }
        })
      );
    }

    if (discountItem && applicableGroup) {
      dispatch(
        addGroupDiscount({
          id: applicableGroup,
          discount: {
            ...discountItem,
            discountType: discountTypes.GROUP_DISCOUNT
          }
        })
      );
    }

    if (applicableItemUUID && itemsById[applicableItemUUID] && addItemToCart) {
      dispatch(
        addCartItem({
          ...itemsById[applicableItemUUID]
          /*price: calculateDiscountedPrice(
              type,
              discount,
              itemsById[applicableItemUUID].price
            ),
            discountedPrice: itemsById[applicableItemUUID].price,
            promoCodeTitle: title*/
        })
      );

      message.success(
        <span onClick={() => message.destroy()}>Success. Promo Item added to cart.</span>,
        5
      );
    }
  };
  useEffect(() => {
    if (businessData) {
      const urlParams = new URLSearchParams(search);
      const type = urlParams.get(DISCOUNT_QUERY_PARAMETER_NAME);
      const { discounts, promotions } = businessData;
      if (type) {
        if (type === DISCOUNT_QUERY_PARAMETER_VALUE) {
          const uuid = urlParams.get(DISCOUNT_UUID_QUERY_PARAMETER_NAME);
          if (uuid && discounts && discounts.length > 0 && !allDiscounts[uuid]) {
            const discountItem = discounts.filter(({ discountUUID }) => discountUUID === uuid);

            if (discountItem && discountItem.length > 0) {
              handleDiscount(uuid, discountItem[0], discountTypes.DISCOUNT);
            }
          }
        }
        if (type === 'p') {
          const uuid = urlParams.get(DISCOUNT_QUERY_PARAMETER_VALUE);
          if (uuid && promotions && promotions.length > 0 && !allDiscounts[uuid]) {
            const promotionItem = promotions.filter((promotion) => promotion.uuid === uuid);

            if (promotionItem && promotionItem.length > 0) {
              const transformedPromotion = transformPromotionToDiscount(promotionItem[0]);
              if (transformedPromotion) {
                handleDiscount(uuid, transformedPromotion, discountTypes.PROMOTION);
              }
            }
          }
        }
      }
    }
  }, [businessData]);

  useEffect(() => {
    if (businessData && loyaltyAndOrderHistory) {
      const { loyaltyProgram, serviceLocationId, serviceAccommodatorId } = businessData;
      const loyaltyStatus = loyaltyAndOrderHistory.loyaltyForUser?.loyaltyStatus;
      if (loyaltyStatus) {
        const { applyDiscount, priceItem, loyaltyUUID, promoPrice } = loyaltyStatus;

        if (
          !allDiscounts[loyaltyUUID] &&
          loyaltyUUID &&
          priceItem.uuid &&
          promoPrice !== undefined &&
          applyDiscount
        ) {
          const transformedLoyalty = transformLoyaltyToDiscount({
            ...loyaltyStatus,
            serviceAccommodatorId,
            serviceLocationId,
            title: loyaltyProgram
          });

          handleDiscount(loyaltyUUID, transformedLoyalty, discountTypes.LOYALTY_STATUS, false);
        }
      }
    }
  }, [businessData, loyaltyAndOrderHistory]);

  return [handleDiscount];
};
