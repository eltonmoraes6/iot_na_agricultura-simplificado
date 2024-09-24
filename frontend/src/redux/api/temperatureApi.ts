import { createApi } from '@reduxjs/toolkit/query/react';
import { ITemperature, ITemperatureResponse } from '../types/temperatureTypes';
import customFetchBase from './customFetchBase';

export const temperatureApi = createApi({
  reducerPath: 'temperatureApi',
  baseQuery: customFetchBase,
  tagTypes: ['Temperature', 'LatestTemperature'],
  endpoints: (builder) => ({
    getTemperature: builder.query<ITemperatureResponse, string>({
      query(id) {
        return {
          url: `/temperatures/${id}`,
          credentials: 'include',
        };
      },
      providesTags: (_result, _error, id) => [{ type: 'Temperature', id }],
    }),

    getLatestTemperature: builder.query<ITemperature[], string>({
      query() {
        return {
          url: `/temperatures/info/latest`,
          credentials: 'include',
        };
      },
      transformResponse: (results: { data: { temperature: ITemperature[] } }) =>
        results.data.temperature,
      providesTags: (_result, _error, id) => [
        { type: 'LatestTemperature', id },
      ],
    }),

    getTemperatures: builder.mutation<ITemperature[], string>({
      query: (queryString: string) => {
        return {
          url: `/temperatures/info/index?${queryString.toString()}`,
          credentials: 'include',
        };
      },
      transformResponse: (results: {
        data: { temperatures: ITemperature[] };
      }) => results.data.temperatures,
    }),
  }),
});

export const {
  useGetTemperatureQuery,
  useGetLatestTemperatureQuery,
  useGetTemperaturesMutation,
} = temperatureApi;
