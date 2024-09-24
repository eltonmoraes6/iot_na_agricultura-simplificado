import { createApi } from '@reduxjs/toolkit/query/react';
import { ISeason, ISeasonResponse } from '../types/seasonTypes';
import customFetchBase from './customFetchBase';

export const seasonApi = createApi({
  reducerPath: 'seasonApi',
  baseQuery: customFetchBase,
  tagTypes: ['Season'],
  endpoints: (builder) => ({
    getSeason: builder.query<ISeasonResponse, string>({
      query(id) {
        return {
          url: `/seasons/${id}`,
          credentials: 'include',
        };
      },
      providesTags: (_result, _error, id) => [{ type: 'Season', id }],
    }),
    getSeasons: builder.mutation<ISeason[], string>({
      query: (queryString: string) => {
        return {
          url: `/seasons/info/index?${queryString.toString()}`,
          credentials: 'include',
        };
      },
      transformResponse: (results: { data: { seasons: ISeason[] } }) =>
        results.data.seasons,
    }),
  }),
});

export const { useGetSeasonQuery, useGetSeasonsMutation } = seasonApi;
