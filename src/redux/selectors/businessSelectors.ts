import { AppState } from "../store";

export const selectServiceAccommodatorId = (state: AppState): string => state.business.data.serviceAccommodatorId;
export const selectserviceLocationId = (state: AppState): string => state.business.data.serviceLocationId;