import { createApi } from '@reduxjs/toolkit/query/react';
import { ISoil, ISoilResponse } from '../types/soilTypes';
import customFetchBase from './customFetchBase';

export const soilApi = createApi({
  reducerPath: 'soilApi',
  baseQuery: customFetchBase,
  tagTypes: ['Soil'],
  endpoints: (builder) => ({
    getSoil: builder.query<ISoilResponse, string>({
      query(id) {
        return {
          url: `/soils/${id}`,
          credentials: 'include',
        };
      },
      providesTags: (_result, _error, id) => [{ type: 'Soil', id }],
    }),
    getSoils: builder.mutation<ISoil[], string>({
      query: (queryString: string) => {
        return {
          url: `/soils/info/index?${queryString.toString()}`,
          credentials: 'include',
        };
      },
      transformResponse: (results: { data: { soils: ISoil[] } }) =>
        results.data.soils,
    }),
  }),
});

export const { useGetSoilQuery, useGetSoilsMutation } = soilApi;
