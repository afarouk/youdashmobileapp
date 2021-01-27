import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '../../services/api';

export const loginRequest = createAsyncThunk('auth/login', async (credentials) => {
  const response = await authAPI.login(credentials);
  return response.data;
});
export const registerNewMemberRequest = createAsyncThunk(
  'auth/registerNewMember',
  async (credentials) => {
    const response = await authAPI.registerNewMember(credentials);
    return response.data;
  }
);
export const updateEmailMobileNamesForUserRequest = createAsyncThunk(
  'auth/updateEmailMobileNamesForUser',
  async (payload) => {
    const response = await authAPI.updateEmailMobileNamesForUser(payload);
    return response.data;
  }
);
export const getRegistrationStatusRequest = createAsyncThunk(
  'auth/getRegistrationStatus',
  async (credentials) => {
    const response = await authAPI.getRegistrationStatus(credentials);
    return response.data;
  }
);
export const getCommunityExpressUserSASLSummaryRequest = createAsyncThunk(
  'auth/getCommunityExpressUserSASLSummary',
  async (credentials) => {
    const response = await authAPI.getCommunityExpressUserSASLSummary(credentials);
    return response.data;
  }
);
export const sendVerificationCodeRequest = createAsyncThunk(
    'auth/sendVerificationCode',
    async (payload) => {
      const response = await authAPI.sendVerificationCode(payload);
      return response.data;
    }
);
export const resendVerificationCodeRequest = createAsyncThunk(
    'auth/resendVerificationCode',
    async (payload) => {
      const response = await authAPI.resendVerificationCode(payload);
      return response.data;
    }
);
const authState = {
  user: null,
  authenticationStatus: null,
  loading: false,
  error: false
};

const authSlice = createSlice({
  name: 'auth',
  initialState: authState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
    },
    logout: (state, action) => {
      state.user = null;
      state.authenticationStatus = null;
    },
    setAuthenticationStatus: (state, action) => {
      state.authenticationStatus = action.payload;
    }
  },
  extraReducers: {
    [loginRequest.pending]: (state, action) => {
      state.loading = true;
      state.error = false;
    },
    [loginRequest.fulfilled]: (state, action) => {
      state.user = action.payload;
      state.loading = false;
    },
    [loginRequest.rejected]: (state, action) => {
      //TODO: Need to handle this in a UI
      state.error = action.error.message;
      state.loading = false;
    },
    [registerNewMemberRequest.pending]: (state, action) => {
      state.loading = true;
      state.error = false;
    },
    [registerNewMemberRequest.fulfilled]: (state, action) => {
      state.user = action.payload;
      state.loading = false;
    },
    [registerNewMemberRequest.rejected]: (state, action) => {
      //TODO: Need to handle this in a UI
      state.error = action.error.message;
      state.loading = false;
    },
    [updateEmailMobileNamesForUserRequest.pending]: (state, action) => {
      state.loading = true;
      state.error = false;
    },
    [updateEmailMobileNamesForUserRequest.fulfilled]: (state, action) => {
      state.user = action.payload;
      state.loading = false;
    },
    [updateEmailMobileNamesForUserRequest.rejected]: (state, action) => {
      //TODO: Need to handle this in a UI
      state.error = action.error.message;
      state.loading = false;
    },
    [getCommunityExpressUserSASLSummaryRequest.pending]: (state, action) => {
      state.loading = true;
      state.error = false;
    },
    [getCommunityExpressUserSASLSummaryRequest.fulfilled]: (state, action) => {
      // state.user = action.payload;
      state.loading = false;
    },
    [getCommunityExpressUserSASLSummaryRequest.rejected]: (state, action) => {
      //TODO: Need to handle this in a UI
      state.error = action.error.message;
      state.loading = false;
    },
    [sendVerificationCodeRequest.pending]: (state, action) => {
      state.loading = true;
      state.error = false;
    },
    [sendVerificationCodeRequest.fulfilled]: (state, action) => {
      state.user = action.payload;
      state.loading = false;
    },
    [sendVerificationCodeRequest.rejected]: (state, action) => {
      //TODO: Need to handle this in a UI
      state.error = action.error.message;
      state.loading = false;
    }
  }
});
export const { login, logout, setAuthenticationStatus } = authSlice.actions;
export const authReducer = authSlice.reducer;
