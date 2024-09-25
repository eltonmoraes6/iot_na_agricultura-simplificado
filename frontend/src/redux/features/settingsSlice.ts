import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ISettingsResponse } from '../types/settingsTypes';

interface ISettingsState {
  settings: ISettingsResponse | null;
}

const initialState: ISettingsState = {
  settings: null,
};

export const settingsSlice = createSlice({
  initialState,
  name: 'settingsSlice',
  reducers: {
    settingsState: (state, action: PayloadAction<ISettingsResponse>) => {
      state.settings = action.payload;
    },
  },
});

export default settingsSlice.reducer;

export const { settingsState } = settingsSlice.actions;
