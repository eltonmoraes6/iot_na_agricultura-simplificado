import { createApi } from '@reduxjs/toolkit/query/react';
import customFetchBase from './customFetchBase';
import { IDailyAndPeriodAveragesResponse, ISensorResponse } from './types';

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
    getAllSensors: builder.query<ISensorResponse[], void>({
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
      transformResponse: (results: { data: { sensors: ISensorResponse[] } }) =>
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
      transformResponse: (response: IDailyAndPeriodAveragesResponse) =>
        response.data,
    }),
  }),
});

export const { useGetAllSensorsQuery, useGetDailyAndPeriodAveragesQuery } =
  sensorApi;
