import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { alertApi } from './api/alertApi';
import { humidityApi } from './api/humidityApi';
import { metricApi } from './api/metricApi';
import { seasonApi } from './api/seasonApi';
import { sensorApi } from './api/sensorApi';
import { settingsApi } from './api/settingsApi';
import { soilApi } from './api/soilApi';
import { temperatureApi } from './api/temperatureApi';
import { waterFlowApi } from './api/waterFlow';
import { weatherApi } from './api/weatherApi';

import humidityReducer from './features/humiditySlice';
import metricReducer from './features/metricSlice';
import seasonReducer from './features/seasonSlice';
import sensorReducer from './features/sensorSlice';
import settingsReducer from './features/settingsSlice';
import soilReducer from './features/soilSlice';
import temperatureReducer from './features/temperatureSlice';
import waterFlowReducer from './features/waterFlowSlice';
import weatherReducer from './features/weatherSlice';

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
    [settingsApi.reducerPath]: settingsApi.reducer,
    settingsState: settingsReducer,
    [waterFlowApi.reducerPath]: waterFlowApi.reducer,
    waterFlowState: waterFlowReducer,
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
      settingsApi.middleware,
      waterFlowApi.middleware,
    ]),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
