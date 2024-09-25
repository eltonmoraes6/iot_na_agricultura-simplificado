import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ISeasonResponse } from '../types/seasonTypes';

interface ISeasonState {
  season: ISeasonResponse | null;
}

const initialState: ISeasonState = {
  season: null,
};

export const seasonSlice = createSlice({
  initialState,
  name: 'seasonSlice',
  reducers: {
    seasonState: (state, action: PayloadAction<ISeasonResponse>) => {
      state.season = action.payload;
    },
  },
});

export default seasonSlice.reducer;

export const { seasonState } = seasonSlice.actions;
