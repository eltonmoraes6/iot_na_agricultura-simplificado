import { createApi } from '@reduxjs/toolkit/query/react';
import { IWaterFlow, IWaterFlowResponse } from '../types/waterFlowTypes';
import customFetchBase from './customFetchBase';

export const waterFlowApi = createApi({
  reducerPath: 'waterFlowApi',
  baseQuery: customFetchBase,
  tagTypes: ['WaterFlow', 'LatestWaterFlow'],
  endpoints: (builder) => ({
    getWaterFlowSingle: builder.query<IWaterFlowResponse, string>({
      query(id) {
        return {
          url: `/water/${id}`,
          credentials: 'include',
        };
      },
      providesTags: (_result, _error, id) => [{ type: 'WaterFlow', id }],
    }),

    getLatestWaterFlow: builder.query<IWaterFlow[], string>({
      query() {
        return {
          url: `/water/info/latest`,
          credentials: 'include',
        };
      },
      transformResponse: (results: {
        data: { waterFlowIndicator: IWaterFlow[] };
      }) => results.data.waterFlowIndicator,
      providesTags: (_result, _error, id) => [{ type: 'LatestWaterFlow', id }],
    }),

    getWaterFlow: builder.mutation<IWaterFlow[], string>({
      query: (queryString: string) => {
        return {
          url: `/water/info/index?${queryString.toString()}`,
          credentials: 'include',
        };
      },
      transformResponse: (results: {
        data: { waterFlowIndicator: IWaterFlow[] };
      }) => results.data.waterFlowIndicator,
    }),
  }),
});

export const {
  useGetWaterFlowSingleQuery,
  useGetLatestWaterFlowQuery,
  useGetWaterFlowMutation,
} = waterFlowApi;
