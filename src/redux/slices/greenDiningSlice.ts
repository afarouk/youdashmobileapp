import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { GENERIC_ERROR_MESSAGE } from '../../config/constants';

import { greenDiningAPI } from '../../services/api';

import { 
  BlockGreenDiningOrderParams, 
  BlockGreenDiningOrderResponse, 
  CancelGreenDiningBlockParams, 
  CancelGreenDiningBlockResponse, 
  GetGreenDiningDetailsParams, 
  GreenDiningDetails,
} from '../../types/api'
import { ORDERING_STATE } from '../../types/greenDining';

type GreenDiningState = {
  data: GreenDiningDetails | null,
  loading: boolean,
  error: boolean,
  orderingState: ORDERING_STATE,

  souuid: string,
  discountUUID: string,

  selectedCount: number,
  blockUUID: string | null,
  blockOrderLoading: boolean,
  blockOrderError: boolean,
  blockOrderErrorMessage: string | null,
  cancelBlockLoading: boolean,
  cancelBlockError: boolean,

  startedAt: number | null, // Timestamp
}

const initialState: GreenDiningState = {
  data: null,
  loading: false,
  error: false,
  orderingState: ORDERING_STATE.NOT_STARTED,

  souuid: '',
  discountUUID: '',

  selectedCount: 1,
  blockUUID: null,
  blockOrderLoading: false,
  blockOrderError: false,
  blockOrderErrorMessage: null,
  cancelBlockLoading: false,
  cancelBlockError: false,

  startedAt: null,
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

type BlockGreenDiningArgs = Omit<Omit<BlockGreenDiningOrderParams, 'serviceAccommodatorId'>, 'serviceLocationId'>

export const blockGreenDiningOrder = createAsyncThunk<BlockGreenDiningOrderResponse, BlockGreenDiningArgs>(
  'greenDining/blockOrder',
  async (params, { rejectWithValue, getState  }) => {
    const state: any = getState();
    const serviceAccommodatorId = state.business.data.serviceAccommodatorId;
    const serviceLocationId = state.business.data.serviceLocationId;

    try {
      const response = await greenDiningAPI.blockGreenDiningOrder({
        ...params,
        serviceAccommodatorId,
        serviceLocationId,
      });
      return response.data
    } catch (error) {
      return rejectWithValue(error);
    }
  }
)

type CancelGreenDiningBlockArgs = Omit<Omit<CancelGreenDiningBlockParams, 'serviceAccommodatorId'>, 'serviceLocationId'>

export const cancelGreenDiningBlock = createAsyncThunk<CancelGreenDiningBlockResponse, CancelGreenDiningBlockArgs>(
  'greenDining/cancelBlock',
  async (params, { rejectWithValue, getState }) => {
    const state: any = getState();
    const serviceAccommodatorId = state.business.data.serviceAccommodatorId;
    const serviceLocationId = state.business.data.serviceLocationId;

    try {
      const response = await greenDiningAPI.cancelGreenDiningBlock({
        ...params,
        serviceAccommodatorId,
        serviceLocationId,
      });
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
    startGreenDiningOrdering: (state) => {
      state.startedAt = Date.now();
      state.orderingState = ORDERING_STATE.STARTED;
    },
    cancelGreenDiningOrder: (state) => {
      return { 
        ...initialState,
        orderingState: ORDERING_STATE.CANCELLED,
      };
    },
    setSelectedCount: (state, action) => {
      state.selectedCount = action.payload;
    },
    resetBlocOrderkError: (state) => {
      state.blockOrderError = false;
      state.blockOrderErrorMessage = null;
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
      state.error = true;
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
      state.blockOrderError = true;
      state.blockOrderErrorMessage = (action.payload as string) || GENERIC_ERROR_MESSAGE;
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
      state.cancelBlockError = true;
    })
})

export const {
  setDiscountUUID,
  setSouuid,
  startGreenDiningOrdering,
  cancelGreenDiningOrder,
  setSelectedCount,
  resetBlocOrderkError,
} = greenDiningSlice.actions;

export const greenDiningReducer = greenDiningSlice.reducer;