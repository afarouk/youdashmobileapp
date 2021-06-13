import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { greenDiningAPI } from '../../services/api';

import { 
  BlockGreenDiningOrderParams, 
  BlockGreenDiningOrderResponse, 
  CancelGreenDiningBlockParams, 
  CancelGreenDiningBlockResponse, 
  GetGreenDiningDetailsParams, 
  GreenDiningDetails,
} from '../../types/api'

type GreenDiningState = {
  data: GreenDiningDetails | null,
  loading: boolean,
  error: boolean,

  souuid: string,
  discountUUID: string,

  blockUUID: string | null,
  blockOrderLoading: boolean,
  blockOrderError: boolean,
  cancelBlockLoading: boolean,
  cancelBlockError: boolean,
}

const initialState: GreenDiningState = {
  data: null,
  loading: false,
  error: false,

  souuid: '',
  discountUUID: '',

  blockUUID: null,
  blockOrderLoading: false,
  blockOrderError: false,
  cancelBlockLoading: false,
  cancelBlockError: false,
}

export const getGreenDiningDetails = createAsyncThunk<GreenDiningDetails, GetGreenDiningDetailsParams>(
  'greenDining/getDetails', 
  async (params, { rejectWithValue }) => {
    try {
      const response = await greenDiningAPI.getGreenDiningDetails(params)
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
)

export const blockGreenDiningOrder = createAsyncThunk<BlockGreenDiningOrderResponse, BlockGreenDiningOrderParams>(
  'greenDining/blockOrder',
  async (params, { rejectWithValue }) => {
    try {
      const response = await greenDiningAPI.blockGreenDiningOrder(params);
      return response.data
    } catch (error) {
      return rejectWithValue(error);
    }
  }
)

export const cancelGreenDiningBlock = createAsyncThunk<CancelGreenDiningBlockResponse, CancelGreenDiningBlockParams>(
  'greenDining/cancelBlock',
  async (params, { rejectWithValue }) => {
    try {
      const response = await greenDiningAPI.cancelGreenDiningBlock(params);
      return response.data;
    } catch (error) {
      rejectWithValue(error);
    }
  }
)

const greenDiningSlice = createSlice({
  name: 'greeDining',
  initialState,
  reducers: {
    setSouuid: (state, action) => {
      state.souuid = action.payload;
    },
    setDiscountUUID: (state, action) => {
      state.discountUUID = action.payload;
    },
  },
  extraReducers: (builder) => builder
    .addCase(getGreenDiningDetails.pending, (state, action) => {
      state.loading = true;
      state.error = false;
    })
    .addCase(getGreenDiningDetails.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
    })
    .addCase(getGreenDiningDetails.rejected, (state, action) => {
      state.loading = false;
      state.error = true; // TODO: handle this case
    })

    .addCase(blockGreenDiningOrder.pending, (state, action) => {
      state.blockOrderLoading = true;
      state.blockOrderError = false;
    })
    .addCase(blockGreenDiningOrder.fulfilled, (state, action) => {
      state.blockOrderLoading = false;
      state.blockUUID = action.payload.blockUUID;
    })
    .addCase(blockGreenDiningOrder.rejected, (state, action) => {
      state.blockOrderLoading = false;
      state.blockOrderError = true; // TODO: handle this case
      // {
      //   "error": {
      //       "type": "unabletocomplyexception",
      //       "message": "Unable to book 1"
      //   }
      // }
    })

    .addCase(cancelGreenDiningBlock.pending, (state, action) => {
      state.cancelBlockLoading = true;
      state.cancelBlockError = false;
    })
    .addCase(cancelGreenDiningBlock.fulfilled, (state, action) => {
      state.cancelBlockLoading = false;
      state.blockUUID = null;
    })
    .addCase(cancelGreenDiningBlock.rejected, (state, action) => {
      state.cancelBlockLoading = false;
      state.cancelBlockError = true; // TODO: handle this case
    })
})

export const {
  setDiscountUUID,
  setSouuid,
} = greenDiningSlice.actions;

export const greenDiningReducer = greenDiningSlice.reducer;