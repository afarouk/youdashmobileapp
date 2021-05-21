import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { paymentAPI } from '../../services/api';
import {
  formatCreditCardNumber,
  formatCVC,
  formatExpirationDate,
  formatFormData
} from "../../utils/ccHelpers";

const initialState = {
  isResolved: false,
  isIframePayment: false,
  ccHolderName: "",
  ccNumber: "",
  ccExpiration: "",
  ccCVC: "",
  ccIssuer: "",
  focused: "",
  streetAddress: "",
  zipCode: "",
  formState: {
    "valid": false,
    "name": "",
    "number" : "",
    "expiry" : "",
    "cvc": "",
  },
  loading: false,
  error: false
};

const ccSlice = createSlice({
  initialState,
  name: 'cc',
  reducers: {
    setIsResolved: (state, action) => {
      state.isResolved = action.payload;
    },
    setIsIframePayment: (state, action) => {
      state.isIframePayment = action.payload;
    },
    setccHolderName: (state, action) => {
      state.ccHolderName = action.payload;
    },
    setccNumber: (state, action) => {
      state.ccNumber = formatCreditCardNumber(action.payload);
    },
    setccCVC: (state, action) => {
      state.ccCVC = formatCVC(action.payload);
    },
    setccExpiration: (state, action) => {
      state.ccExpiration = formatExpirationDate(action.payload);
    },
    setstreetAddress: (state, action) => {
      state.streetAddress = action.payload.streetAddress;
    },
    setzipCode: (state, action) => {
      state.zipCode = action.payload.zipCode;
    },
    setccIssuer: (state, action) => {
      state.ccIssuer = action.payload;
    },
    setFocused: (state, action) => {
      state.focused = action.payload;
    },
    setFormState: (state, action) => {
      const { name, value } = action.payload;
      state.formState[name] = value;
    },
  },
});

export const {
  setIsResolved,
  setIsIframePayment,
  setccHolderName,
  setccNumber,
  setccCVC,
  setccExpiration,
  setccIssuer,
  setstreetAddress,
  setzipCode,
  setFocused,
  setFormState
} = ccSlice.actions;

export const ccReducer = ccSlice.reducer;
