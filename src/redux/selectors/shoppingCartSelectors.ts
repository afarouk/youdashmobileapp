import { AppState } from "../store"

export const selectTablePath = (state: AppState) => {
  const { tableDetails } = state.shoppingCart;
  
  if (!tableDetails) {
    return null;
  }

  const { levelId, zoneId, tableId } = tableDetails

  return `${levelId}#${zoneId}#${tableId}`;
}