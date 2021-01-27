import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  errorMessage: null
};

const globalErrorSlice = createSlice({
  name: 'global-error',
  initialState: initialState,
  reducers: {
    resetGlobalErrorMessage: (state) => {
      state.errorMessage = null;
    }
  },
  extraReducers: (builder) =>
    builder.addMatcher(
      (action) => action.type.endsWith('rejected'),
      (state, action) => {
        state.errorMessage = action?.error?.message;
      }
    )
  // and provide a default case if no other handlers matched
  // .addDefaultCase((state, action) => {})
});
export const { resetGlobalErrorMessage } = globalErrorSlice.actions;
export const globalErrorReducer = globalErrorSlice.reducer;
