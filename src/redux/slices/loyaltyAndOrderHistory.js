import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { userAPI } from '../../services/api';

const initialState = {
  data: null,
  loading: false,
  error: false
};

export const getLoyaltyAndOrderHistory = createAsyncThunk('loayltyAndOrderHistory/getLoyaltyAndOrderHistory', async (data) => {
  const response = await userAPI.getLoyaltyAndOrderHistory(data);
  return response.data;
});

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
  },
  extraReducers: (builder) => {
    return builder
      .addCase(getLoyaltyAndOrderHistory.pending, (state, action) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(getLoyaltyAndOrderHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.error = false;
        state.data = action.payload;
      })
      .addCase(getLoyaltyAndOrderHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
      })
  }
});
export const { setLoyaltyAndOrderHistoryData, resetData } = loyaltyAndOrderHistorySlice.actions;
export const loyaltyAndOrderHistoryReducer = loyaltyAndOrderHistorySlice.reducer;
