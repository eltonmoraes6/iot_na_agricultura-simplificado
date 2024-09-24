import { createApi } from '@reduxjs/toolkit/query/react';
import { IHumidity, IHumidityResponse } from '../types/humidityTypes';
import customFetchBase from './customFetchBase';

export const humidityApi = createApi({
  reducerPath: 'humidityApi',
  baseQuery: customFetchBase,
  tagTypes: ['Humidity', 'LatestHumidity'],
  endpoints: (builder) => ({
    getHumidity: builder.query<IHumidityResponse, string>({
      query(id) {
        return {
          url: `/humidities/${id}`,
          credentials: 'include',
        };
      },
      providesTags: (_result, _error, id) => [{ type: 'Humidity', id }],
    }),

    getLatestHumidity: builder.query<IHumidity[], string>({
      query() {
        return {
          url: `/humidities/info/latest`,
          credentials: 'include',
        };
      },
      transformResponse: (results: { data: { humidity: IHumidity[] } }) =>
        results.data.humidity,
      providesTags: (_result, _error, id) => [{ type: 'LatestHumidity', id }],
    }),

    getHumidities: builder.mutation<IHumidity[], string>({
      query: (queryString: string) => {
        return {
          url: `/humidities/info/index?${queryString.toString()}`,
          credentials: 'include',
        };
      },
      transformResponse: (results: { data: { humidities: IHumidity[] } }) =>
        results.data.humidities,
    }),
  }),
});

export const {
  useGetHumidityQuery,
  useGetLatestHumidityQuery,
  useGetHumiditiesMutation,
} = humidityApi;
