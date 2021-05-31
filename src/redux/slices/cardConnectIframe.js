import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: '',
  error: false
};

const cardConnectIframeSlice = createSlice({
  initialState,
  name: 'cardConnectIframe',
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
  },
});

export const {
  setToken,
} = cardConnectIframeSlice.actions;

export const cardConnectIframeReducer = cardConnectIframeSlice.reducer;
