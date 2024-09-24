import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IHumidityResponse } from '../types/humidityTypes';

interface IHumidityState {
  humidity: IHumidityResponse | null;
}

const initialState: IHumidityState = {
  humidity: null,
};

export const humiditySlice = createSlice({
  initialState,
  name: 'humiditySlice',
  reducers: {
    humidityState: (state, action: PayloadAction<IHumidityResponse>) => {
      state.humidity = action.payload;
    },
  },
});

export default humiditySlice.reducer;

export const { humidityState } = humiditySlice.actions;
