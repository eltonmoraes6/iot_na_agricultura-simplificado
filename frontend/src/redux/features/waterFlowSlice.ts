import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IWaterFlowResponse } from '../types/waterFlowTypes';

interface IWaterFlowState {
  waterFlow: IWaterFlowResponse | null;
}

const initialState: IWaterFlowState = {
  waterFlow: null,
};

export const waterFlowSlice = createSlice({
  initialState,
  name: 'waterFlowSlice',
  reducers: {
    WaterFlowState: (state, action: PayloadAction<IWaterFlowResponse>) => {
      state.waterFlow = action.payload;
    },
  },
});

export default waterFlowSlice.reducer;

export const { WaterFlowState } = waterFlowSlice.actions;
