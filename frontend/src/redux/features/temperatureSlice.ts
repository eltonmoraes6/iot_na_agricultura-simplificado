import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ITemperatureResponse } from '../types/temperatureTypes';

interface ITemperatureState {
  temperature: ITemperatureResponse | null;
}

const initialState: ITemperatureState = {
  temperature: null,
};

export const temperatureSlice = createSlice({
  initialState,
  name: 'temperatureSlice',
  reducers: {
    temperatureState: (state, action: PayloadAction<ITemperatureResponse>) => {
      state.temperature = action.payload;
    },
  },
});

export default temperatureSlice.reducer;

export const { temperatureState } = temperatureSlice.actions;
