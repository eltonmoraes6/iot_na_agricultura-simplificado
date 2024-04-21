import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { sensorApi } from './api/sensorApi';
import sensorReducer from './features/sensorSlice';

export const store = configureStore({
  reducer: {
    [sensorApi.reducerPath]: sensorApi.reducer,
    sensorState: sensorReducer,
  },
  devTools: import.meta.env.VITE_NODE_ENV === 'development',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({}).concat([sensorApi.middleware]),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
