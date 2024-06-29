import { createApi } from '@reduxjs/toolkit/query/react';
import customFetchBase from './customFetchBase';

export const weatherApi = createApi({
  reducerPath: 'weatherApi',
  baseQuery: customFetchBase,
  tagTypes: ['Weather'],
  endpoints: (builder) => ({
    setWeather: builder.mutation({
      query: ({ lat, lon }) => {
        return {
          url: `/weather`,
          method: 'POST',
          credentials: 'include',
          body: { lat, lon },
        };
      },
    }),
    getWeather: builder.query({
      query: ({ lat, lon }) => {
        return {
          url: `/weather?lat=${lat}&lon=${lon}`,
          method: 'GET',
          credentials: 'include',
        };
      },
    }),
  }),
});

export const { useSetWeatherMutation, useGetWeatherQuery } = weatherApi;
