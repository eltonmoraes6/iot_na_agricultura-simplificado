import { createApi } from '@reduxjs/toolkit/query/react';

import customFetchBase from './customFetchBase';

export interface Alert {
  id: string;
  message: string;
  type: string;
}

export const alertApi = createApi({
  reducerPath: 'alertApi',
  baseQuery: customFetchBase,
  endpoints: (builder) => ({
    fetchAlerts: builder.query<Alert[], string>({
      query: () => `/soils/predict-pests-and-diseases`,
    }),
  }),
});

export const { useFetchAlertsQuery } = alertApi;
