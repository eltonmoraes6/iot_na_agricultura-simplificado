import { createApi } from '@reduxjs/toolkit/query/react';
import customFetchBase from './customFetchBase';
import {
  IDailyAndPeriodAveragesResponse,
  ISensor,
  ISensorResponse,
} from './types';

export const sensorApi = createApi({
  reducerPath: 'sensorApi',
  baseQuery: customFetchBase,
  tagTypes: ['Sensors', 'DailyAndPeriodAverages'],
  endpoints: (builder) => ({
    getSensor: builder.query<ISensorResponse, string>({
      query(id) {
        return {
          url: `/sensors/${id}`,
          credentials: 'include',
        };
      },
      providesTags: (_result, _error, id) => [{ type: 'Sensors', id }],
    }),
    getOneSensor: builder.query<ISensor[], string>({
      query() {
        return {
          url: `/sensors/info/one`,
          credentials: 'include',
        };
      },
      transformResponse: (results: { data: { sensors: ISensor[] } }) =>
        results.data.sensors,
    }),
    getSensors: builder.mutation<ISensor[], string>({
      query: (queryString: string) => {
        return {
          url: `/sensors/info/advanced?${queryString.toString()}`,
          credentials: 'include',
        };
      },
      transformResponse: (results: { data: { sensors: ISensor[] } }) =>
        results.data.sensors,
    }),
    getAllSensors: builder.query<ISensor[], void>({
      query() {
        return {
          url: `/sensors/index`,
          credentials: 'include',
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: 'Sensors' as const,
                id,
              })),
              { type: 'Sensors', id: 'LIST' },
            ]
          : [{ type: 'Sensors', id: 'LIST' }],
      transformResponse: (results: { data: { sensors: ISensor[] } }) =>
        results.data.sensors,
    }),
    // Query to get daily and period-based averages
    getDailyAndPeriodAverages: builder.query<
      IDailyAndPeriodAveragesResponse,
      void
    >({
      query() {
        return {
          url: `/sensors/info/daily-and-period-averages`, // Endpoint for this query
          credentials: 'include', // Adjust credentials policy as needed
        };
      },
      providesTags: [{ type: 'DailyAndPeriodAverages', id: 'AVERAGES' }],
      transformResponse: (response: IDailyAndPeriodAveragesResponse) => {
        // Check if the response has the expected fields
        if (
          typeof response.status === 'string' &&
          Array.isArray(response.data) &&
          response.data.every((item) => typeof item.period === 'string')
        ) {
          return response.data as unknown as IDailyAndPeriodAveragesResponse; // Explicitly cast to the expected type
        } else {
          // If the response doesn't meet expectations, throw an error or return a default value
          throw new Error('Unexpected response format');
        }
      },
    }),
  }),
});

export const {
  useGetAllSensorsQuery,
  useGetOneSensorQuery,
  useGetDailyAndPeriodAveragesQuery,
  useGetSensorsMutation,
} = sensorApi;
