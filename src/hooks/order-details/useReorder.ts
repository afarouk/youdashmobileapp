import { produce } from 'immer';
import { useDispatch } from 'react-redux';

import { updateSubSubItemsVersionPriceAdjustment } from '../product-item/useProductItem';
import { useSelector } from '../../redux/store';
import { addCartItem } from '../../redux/slices/shoppingCart';

export const useReorder = () => {
  const dispatch = useDispatch();
  const businessData = useSelector(state => state.business.data);

  const reorderItems = (items: any) => {
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
    });
  }

  return { reorderItems }
}