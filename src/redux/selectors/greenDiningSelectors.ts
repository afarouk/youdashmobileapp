import { AppState } from "../store"

export const selectGreenDiningOrderingActivated = (state: AppState): boolean => {
  return Boolean(state.greenDining.blockUUID)
}

export const selectIsGreenDiningOrder = (state: AppState): boolean => {
  return Boolean(state.greenDining.blockUUID && state.greenDining.startedAt);
}