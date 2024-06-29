import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IWeatherResponse } from '../api/types';

interface IWeatherState {
  weather: IWeatherResponse | null;
}

const initialState: IWeatherState = {
  weather: null,
};

export const weatherSlice = createSlice({
  initialState,
  name: 'weatherSlice',
  reducers: {
    weatherState: (state, action: PayloadAction<IWeatherResponse>) => {
      state.weather = action.payload;
    },
  },
});

export default weatherSlice.reducer;

export const { weatherState } = weatherSlice.actions;
