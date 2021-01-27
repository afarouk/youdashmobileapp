import React, { useEffect, useState } from 'react';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import { OrderHistory } from '../components/OrderHistory/OrderHistory';
import { addCartItem } from '../redux/slices/shoppingCart';
import { useDispatch, useSelector } from 'react-redux';
import { produce } from 'immer';
import { updateSubSubItemsVersionPriceAdjustment } from '../hooks/product-item/useProductItem';
import useGetUserSASLSummary from '../hooks/user/useGetUserSASLSummary';
const OrderHistoryPage = ({ businessData, loyaltyAndOrderHistory }) => {
  const { search } = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();
  const { businessUrlKey } = useParams();
  const [orderHistory, setOrderHistory] = useState([]);
  let [user, loyalty, reloadHistory, loading] = useGetUserSASLSummary();

  useEffect(() => {
    if (loyaltyAndOrderHistory && loyaltyAndOrderHistory.orderHistory) {
      setOrderHistory(loyaltyAndOrderHistory.orderHistory);
    }
  }, [loyaltyAndOrderHistory]);

  const handleReOrder = (items) => {
    if (items && items.length > 0) {
      items.map(({ itemOptionsString, itemVersion, item, ...rest }) => {
        let itemFromCollection = produce(businessData.itemsById[item.uuid], (draft) => {});

        if (itemFromCollection) {
          let itemOptions = null;
          try {
            itemOptions = JSON.parse(itemOptionsString);
          } catch (e) {
            itemOptions = itemFromCollection.itemOptions;
          }

          let itemPrice =
            itemVersion && typeof itemVersion === 'object'
              ? itemVersion.price
              : itemFromCollection.price;
          let itemVersionId =
            itemVersion && typeof itemVersion === 'object'
              ? itemVersion.itemVersion
              : itemFromCollection.itemVersion;

          let subOptions = itemOptions?.subOptions;
          let subItems = itemOptions?.subItems;
          let subItemsLeft = itemOptions?.subItemsLeft;

          if (subOptions && subOptions.length) {
            const result = updateSubSubItemsVersionPriceAdjustment(itemVersionId, subOptions);
            itemPrice += result.newPriceDifference;
          }
          if (subItems && subItems.length) {
            const result = updateSubSubItemsVersionPriceAdjustment(itemVersionId, subItems);
            itemPrice += result.newPriceDifference;
          }
          if (subItemsLeft && subItemsLeft.length) {
            const result = updateSubSubItemsVersionPriceAdjustment(itemVersionId, subItemsLeft);
            itemPrice += result.newPriceDifference;
          }

          dispatch(
            addCartItem({
              ...itemFromCollection,
              quantity: item.quantity,
              itemVersion: item.itemVersion,
              itemOptions: itemOptions,
              price: itemPrice
            })
          );
        }
        return item;
      });
      history.push(`/${businessUrlKey}/order-details${search}`);
    }
  };
  return (
    <OrderHistory
      orders={orderHistory}
      onReOrder={handleReOrder}
      loading={loading}
      onReloadHistory={reloadHistory}
    />
  );
};

export default OrderHistoryPage;
