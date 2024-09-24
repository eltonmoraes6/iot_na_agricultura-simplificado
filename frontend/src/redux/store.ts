import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { alertApi } from './api/alertApi';
import { sensorApi } from './api/sensorApi';
import { soilApi } from './api/soilApi';
import { weatherApi } from './api/weatherApi';

import { humidityApi } from './api/humidityApi';
import { metricApi } from './api/metricApi';
import { seasonApi } from './api/seasonApi';
import { temperatureApi } from './api/temperatureApi';

import sensorReducer from './features/sensorSlice';
import soilReducer from './features/soilSlice';
import weatherReducer from './features/weatherSlice';

import humidityReducer from './features/humiditySlice';
import metricReducer from './features/metricSlice';
import seasonReducer from './features/seasonSlice';
import temperatureReducer from './features/temperatureSlice';

export const store = configureStore({
  reducer: {
    [sensorApi.reducerPath]: sensorApi.reducer,
    sensorState: sensorReducer,
    [soilApi.reducerPath]: soilApi.reducer,
    soilState: soilReducer,
    [weatherApi.reducerPath]: weatherApi.reducer,
    weatherState: weatherReducer,
    [alertApi.reducerPath]: alertApi.reducer,
    [humidityApi.reducerPath]: humidityApi.reducer,
    humidityState: humidityReducer,
    [temperatureApi.reducerPath]: temperatureApi.reducer,
    temperatureState: temperatureReducer,
    [metricApi.reducerPath]: metricApi.reducer,
    metricState: metricReducer,
    [seasonApi.reducerPath]: seasonApi.reducer,
    seasonState: seasonReducer,
  },
  devTools: import.meta.env.VITE_NODE_ENV === 'development',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({}).concat([
      sensorApi.middleware,
      soilApi.middleware,
      weatherApi.middleware,
      alertApi.middleware,
      humidityApi.middleware,
      temperatureApi.middleware,
      metricApi.middleware,
      seasonApi.middleware,
    ]),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
