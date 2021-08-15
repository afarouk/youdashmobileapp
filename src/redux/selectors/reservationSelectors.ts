import { convertDateToIsoString } from "../../utils/dateHelpers";
import { splitDateString } from "../../utils/helpers";

import { AppState } from "../store";

export const selectReservationEnabled = (state: AppState): boolean => {
  if (!state.business.data) return false;
  return state.business.data.services.appointmentService.masterEnabled;
}

export const selectReservationDate = (state: AppState): string | undefined => {
  const orderPickUp = state.shoppingCart.orderPickUp;

  if (orderPickUp && orderPickUp.date && orderPickUp.time) {
    const [year, month, day] = splitDateString(orderPickUp.date);
    const [hours, minutes] = orderPickUp.time.split(':');
    
    return convertDateToIsoString(year, month, day, parseInt(hours), parseInt(minutes));
  }
}