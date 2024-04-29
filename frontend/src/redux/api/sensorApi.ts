import { createApi } from '@reduxjs/toolkit/query/react';
import customFetchBase from './customFetchBase';
import {
  IDailyAndPeriodAveragesResponse,
  ISensorResponse,
  SensorQueryParams,
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
    getSensors: builder.query<ISensorResponse[], SensorQueryParams>({
      query: ({ filters, sort, pagination }) => {
        let queryStr = '?';

        // Adding filters to the query
        if (filters) {
          for (const key in filters) {
            queryStr += `${key}=${filters[key]}&`;
          }
        }

        // Adding sorting to the query
        if (sort) {
          queryStr += `sort=${sort.field},${sort.order}&`;
        }

        // Adding pagination to the query
        if (pagination) {
          queryStr += `page=${pagination.page}&limit=${pagination.limit}`;
        }

        return { url: `sensors/info/advanced${queryStr}` };
      },
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
  useGetDailyAndPeriodAveragesQuery,
  useGetSensorsQuery,
} = sensorApi;
