import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { GENERIC_ERROR_MESSAGE } from '../../config/constants';
import { reservationAPI } from '../../services/api';
import { AddReservationData, Reservation } from '../../types/reservation';

type ReservationState = {
  peopleCount: number,

  data: Reservation | null,

  addReservationLoading: boolean,
  addReservationError: string | null | undefined,
}

const initialState: ReservationState = {
  peopleCount: 1,
  
  data: null,

  addReservationLoading: false,
  addReservationError: null,
}

export const addReservationAction = createAsyncThunk<Reservation, AddReservationData, { rejectValue: string }>(
  'reservation/add',
  async (data, { rejectWithValue, getState  }) => {
    // TODO: move serviceAccommodatorId, serviceLocationId logic to API
    const state: any = getState();
    const serviceAccommodatorId = state.business.data.serviceAccommodatorId;
    const serviceLocationId = state.business.data.serviceLocationId;
    const uid = state.auth.user.uid;

    try {
      const response = await reservationAPI.addWaitListEnty({
        ...data,
        serviceLocationId,
        serviceAccommodatorId,
        uid,
      })

      return response.data;
    } catch (error) {
      return rejectWithValue(error || GENERIC_ERROR_MESSAGE);
    }
  }
)

const reservationSlice = createSlice({
  name: 'reservation',
  initialState,
  reducers: {
    setPeopleCount: (state, action: PayloadAction<number>) => {
      state.peopleCount = action.payload;
    }
  },
  extraReducers: (builder) => builder
    .addCase(addReservationAction.pending, (state, action) => {
      state.addReservationLoading = true;
      state.addReservationError = null;
    })
    .addCase(addReservationAction.fulfilled, (state, action) => {
      state.addReservationLoading = false;
      state.data = action.payload;
    })
    .addCase(addReservationAction.rejected, (state, action) => {
      state.addReservationLoading = false;
      console.log('action', action)
      state.addReservationError = action.payload;
    })
})

export const { 
  setPeopleCount,
} = reservationSlice.actions

export const reservationReducer = reservationSlice.reducer;