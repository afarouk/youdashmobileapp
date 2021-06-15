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