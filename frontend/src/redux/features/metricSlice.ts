import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IMetricResponse } from '../types/metricTypes';

interface IMetricState {
  metric: IMetricResponse | null;
}

const initialState: IMetricState = {
  metric: null,
};

export const metricSlice = createSlice({
  initialState,
  name: 'metricSlice',
  reducers: {
    metricState: (state, action: PayloadAction<IMetricResponse>) => {
      state.metric = action.payload;
    },
  },
});

export default metricSlice.reducer;

export const { metricState } = metricSlice.actions;
