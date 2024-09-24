import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ISoilResponse } from '../types/soilTypes';

interface ISoilState {
  soil: ISoilResponse | null;
}

const initialState: ISoilState = {
  soil: null,
};

export const soilSlice = createSlice({
  initialState,
  name: 'soilSlice',
  reducers: {
    soilState: (state, action: PayloadAction<ISoilResponse>) => {
      state.soil = action.payload;
    },
  },
});

export default soilSlice.reducer;

export const { soilState } = soilSlice.actions;
