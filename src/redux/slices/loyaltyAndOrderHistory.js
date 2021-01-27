import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: null,
  loading: false,
  error: false
};

const loyaltyAndOrderHistorySlice = createSlice({
  name: 'loyaltyAndOrderHistory',
  initialState: initialState,
  reducers: {
    setLoyaltyAndOrderHistoryData: (state, action) => {
      state.data = action.payload;
    },
    resetData: (state, action) => {
      state.data = null;
    }
  }
});
export const { setLoyaltyAndOrderHistoryData, resetData } = loyaltyAndOrderHistorySlice.actions;
export const loyaltyAndOrderHistoryReducer = loyaltyAndOrderHistorySlice.reducer;
