import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ISensorResponse } from '../api/types';

interface ISensorState {
  sensor: ISensorResponse | null;
}

const initialState: ISensorState = {
  sensor: null,
};

export const sensorSlice = createSlice({
  initialState,
  name: 'sensorSlice',
  reducers: {
    sensorState: (state, action: PayloadAction<ISensorResponse>) => {
      state.sensor = action.payload;
    },
  },
});

export default sensorSlice.reducer;

export const { sensorState } = sensorSlice.actions;
