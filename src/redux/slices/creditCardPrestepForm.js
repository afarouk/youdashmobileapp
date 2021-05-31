import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  formState: {
    streetAddress: '',
    streetAddressDetails: '',
    zipCode: '',
  },
  error: false
};

const creditCardPrestepFormSlice = createSlice({
  initialState,
  name: 'creditCardPrestepForm',
  reducers: {
    setFormFieldState: (state, action) => {
      const { name, value } = action.payload;
      state.formState[name] = value;
    },
  },
});

export const {
  setFormFieldState,
} = creditCardPrestepFormSlice.actions;

export const creditCardPrestepFormReducer = creditCardPrestepFormSlice.reducer;
