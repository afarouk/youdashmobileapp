import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: '',
  error: false
};

const heartlandSlice = createSlice({
  initialState,
  name: 'heartland',
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
  },
});

export const {
  setToken,
} = heartlandSlice.actions;

export const heartlandReducer = heartlandSlice.reducer;
