import { produce } from 'immer';
import { useDispatch } from 'react-redux';

import { updateSubSubItemsVersionPriceAdjustment } from '../product-item/useProductItem';
import { useSelector } from '../../redux/store';
import { addCartItem } from '../../redux/slices/shoppingCart';
import { BusinessData } from '../../types/businessData';
import { Dispatch } from 'redux';

export const useReorder = () => {
  const dispatch = useDispatch();
  const businessData = useSelector(state => state.business.data);

  const customReorderItems = (items: any) => {
    return reorderItems(items, businessData, dispatch);
  }

  return { reorderItems: customReorderItems }
}

export const reorderItems = (items: any, businessData: BusinessData, dispatch: Dispatch<any>) => {
  items.forEach(({ itemOptionsString, itemVersion, item, ...rest }: any) => {
    let itemFromCollection: any = produce(businessData.itemsById[item.uuid], (draft: any) => {});

    if (itemFromCollection) {
      let itemOptions: any = null;
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

      let s0/*subOptions*/ = itemOptions?.s0/*subOptions*/;
      let s1/*subItems*/ = itemOptions?.s1/*subItems*/;
      let s2/*subItemsLeft*/ = itemOptions?.s2/*subItemsLeft*/;

      if (s0/*subOptions*/ && s0/*subOptions*/.length) {
        const result = updateSubSubItemsVersionPriceAdjustment(itemVersionId, s0/*subOptions*/);
        itemPrice += result.newPriceDifference;
      }
      if (s1/*subItems*/ && s1/*subItems*/.length) {
        const result = updateSubSubItemsVersionPriceAdjustment(itemVersionId, s1/*subItems*/);
        itemPrice += result.newPriceDifference;
      }
      if (s2/*subItemsLeft*/ && s2/*subItemsLeft*/.length) {
        const result = updateSubSubItemsVersionPriceAdjustment(itemVersionId, s2/*subItemsLeft*/);
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
  });
}