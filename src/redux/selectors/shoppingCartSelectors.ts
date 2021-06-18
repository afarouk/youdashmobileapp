import { createSelector } from 'reselect';

import { AppState } from "../store"

export const selectTableId = (state: AppState) => {
  return state.shoppingCart.tableDetails?.tableId;
}

export const selectTablePath = (state: AppState) => {
  const { tableDetails } = state.shoppingCart;
  
  if (!tableDetails) {
    return null;
  }

  const { levelId, zoneId, tableId } = tableDetails

  return `${levelId}#${zoneId}#${tableId}`;
}

export const selectSubTotalWithoutDiscounts = createSelector(
  (state: AppState) => state.shoppingCart.items,
  (items): number => {
    const subTotal = items.reduce((price, item) => {
      return price + item.price * item.quantity;
    },0)
    
    return subTotal;
  }
)
