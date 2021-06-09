import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: '',
  error: false
};

const nabancardSlice = createSlice({
  initialState,
  name: 'nabancard',
  reducers: {
    setData: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const {
  setData,
} = nabancardSlice.actions;

export const nabancardReducer = nabancardSlice.reducer;
