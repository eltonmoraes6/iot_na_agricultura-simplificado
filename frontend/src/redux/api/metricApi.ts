import { createApi } from '@reduxjs/toolkit/query/react';
import {
  PotentialEvapotranspirationRequest,
  PotentialEvapotranspirationResponse,
  WaterDeficiencyRequest,
  WaterDeficiencyResponse,
} from '../../utils/types';
import { IAverages, IMetric, IMetricResponse } from '../types/metricTypes';
import customFetchBase from './customFetchBase';

export const metricApi = createApi({
  reducerPath: 'metricApi',
  baseQuery: customFetchBase,
  tagTypes: ['Metric', 'MetricAverages'],
  endpoints: (builder) => ({
    getMetric: builder.query<IMetricResponse, string>({
      query(id) {
        return {
          url: `/metrics/${id}`,
          credentials: 'include',
        };
      },
      providesTags: (_result, _error, id) => [{ type: 'Metric', id }],
    }),
    getAverages: builder.query<IAverages[], string>({
      query() {
        return {
          url: `/metrics/info/averages`,
          credentials: 'include',
        };
      },
      transformResponse: (results: { data: { averages: IAverages[] } }) =>
        results.data.averages,
      providesTags: (_result, _error, id) => [{ type: 'MetricAverages', id }],
    }),
    getMetrics: builder.mutation<IMetric[], string>({
      query: (queryString: string) => {
        return {
          url: `/metrics/info/index?${queryString.toString()}`,
          credentials: 'include',
        };
      },
      transformResponse: (results: { data: { metrics: IMetric[] } }) =>
        results.data.metrics,
    }),
    calculateWaterDeficiency: builder.mutation<
      WaterDeficiencyResponse,
      WaterDeficiencyRequest
    >({
      query: (body) => ({
        url: '/metrics/calculate-water-deficiency',
        method: 'POST',
        body,
      }),
    }),
    calculatePotentialEvapotranspiration: builder.mutation<
      PotentialEvapotranspirationResponse,
      PotentialEvapotranspirationRequest
    >({
      query: (body) => ({
        url: '/metrics/calculate-potential-evapotranspiration',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {
  useGetMetricQuery,
  useGetMetricsMutation,
  useGetAveragesQuery,
  useCalculateWaterDeficiencyMutation,
  useCalculatePotentialEvapotranspirationMutation,
} = metricApi;
