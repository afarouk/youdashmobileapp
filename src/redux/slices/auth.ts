import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '../../services/api';
import { User } from '../../types/user';

export const loginRequest = createAsyncThunk('auth/login', async (credentials) => {
  const response = await authAPI.login(credentials);
  return response.data;
});
export const registerNewMemberRequest = createAsyncThunk<any, any>(
  'auth/registerNewMember',
  async (credentials) => {
    const response = await authAPI.registerNewMember(credentials);
    return response.data;
  }
);
export const updateEmailMobileNamesForUserRequest = createAsyncThunk<any, any>(
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
export const sendVerificationCodeRequest = createAsyncThunk<any, any>(
    'auth/sendVerificationCode',
    async (payload) => {
      const response = await authAPI.sendVerificationCode(payload);
      return response.data;
    }
);
export const resendVerificationCodeRequest = createAsyncThunk<any, any>(
    'auth/resendVerificationCode',
    async (payload) => {
      const response = await authAPI.resendVerificationCode(payload);
      return response.data;
    }
);

type AuthState = {
  user: null | User;
  authenticationStatus: any,
  loading: boolean,
  error: boolean | string,
}

const authState: AuthState = {
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
    [loginRequest.pending.toString()]: (state, action) => {
      state.loading = true;
      state.error = false;
    },
    [loginRequest.fulfilled.toString()]: (state, action) => {
      state.user = action.payload;
      state.loading = false;
    },
    [loginRequest.rejected.toString()]: (state, action) => {
      //TODO: Need to handle this in a UI
      state.error = action.error.message;
      state.loading = false;
    },
    [registerNewMemberRequest.pending.toString()]: (state, action) => {
      state.loading = true;
      state.error = false;
    },
    [registerNewMemberRequest.fulfilled.toString()]: (state, action) => {
      state.user = action.payload;
      state.loading = false;
    },
    [registerNewMemberRequest.rejected.toString()]: (state, action) => {
      //TODO: Need to handle this in a UI
      state.error = action.error.message;
      state.loading = false;
    },
    [updateEmailMobileNamesForUserRequest.pending.toString()]: (state, action) => {
      state.loading = true;
      state.error = false;
    },
    [updateEmailMobileNamesForUserRequest.fulfilled.toString()]: (state, action) => {
      state.user = action.payload;
      state.loading = false;
    },
    [updateEmailMobileNamesForUserRequest.rejected.toString()]: (state, action) => {
      //TODO: Need to handle this in a UI
      state.error = action.error.message;
      state.loading = false;
    },
    [getCommunityExpressUserSASLSummaryRequest.pending.toString()]: (state, action) => {
      state.loading = true;
      state.error = false;
    },
    [getCommunityExpressUserSASLSummaryRequest.fulfilled.toString()]: (state, action) => {
      // state.user = action.payload;
      state.loading = false;
    },
    [getCommunityExpressUserSASLSummaryRequest.rejected.toString()]: (state, action) => {
      //TODO: Need to handle this in a UI
      state.error = action.error.message;
      state.loading = false;
    },
    [sendVerificationCodeRequest.pending.toString()]: (state, action) => {
      state.loading = true;
      state.error = false;
    },
    [sendVerificationCodeRequest.fulfilled.toString()]: (state, action) => {
      state.user = action.payload;
      state.loading = false;
    },
    [sendVerificationCodeRequest.rejected.toString()]: (state, action) => {
      //TODO: Need to handle this in a UI
      state.error = action.error.message;
      state.loading = false;
    }
  }
});
export const { login, logout, setAuthenticationStatus } = authSlice.actions;
export const authReducer = authSlice.reducer;
