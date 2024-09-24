import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ISeasonResponse } from '../types/seasonTypes';

interface ISoilState {
  soil: ISeasonResponse | null;
}

const initialState: ISoilState = {
  soil: null,
};

export const seasonSlice = createSlice({
  initialState,
  name: 'seasonSlice',
  reducers: {
    soilState: (state, action: PayloadAction<ISeasonResponse>) => {
      state.soil = action.payload;
    },
  },
});

export default seasonSlice.reducer;

export const { soilState } = seasonSlice.actions;
