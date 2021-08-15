import { createSelector } from 'reselect';
import { convertDateToIsoString } from '../../utils/dateHelpers';
import { splitDateString } from '../../utils/helpers';

import { AppState } from "../store"
import { selectIsGreenDiningOrder } from './greenDiningSelectors';

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

export const selectRequestedDeliveryDate = (state: AppState) => {
  const orderPickUp = state.shoppingCart.orderPickUp;
  const isGreenDiningOrder = selectIsGreenDiningOrder(state);
  const greenDiningInfo = state.greenDining.data;

  let requestedDeliveryDate = '';

  if (isGreenDiningOrder) {
    const { year, month, day } = greenDiningInfo!.pickupDayTime.day;
    const { hour, minute } = greenDiningInfo!.pickupDayTime.times[0];
    
    requestedDeliveryDate = convertDateToIsoString(year, month, day, hour, minute);
  } else if (orderPickUp && orderPickUp.date && orderPickUp.time) {
    const [year, month, day] = splitDateString(orderPickUp.date);
    const [hours, minutes] = orderPickUp.time.split(':');
    
    requestedDeliveryDate = convertDateToIsoString(year, month, day, parseInt(hours), parseInt(minutes));
  }

  return requestedDeliveryDate
}
