import { createApi } from '@reduxjs/toolkit/query/react';
import {
  IdealHumidityRequest,
  IdealHumidityResponse,
  IdealTemperatureRequest,
  IdealTemperatureResponse,
  PotentialEvapotranspirationRequest,
  PotentialEvapotranspirationResponse,
  WaterDeficiencyRequest,
  WaterDeficiencyResponse,
} from '../../utils/types';
import customFetchBase from './customFetchBase';
import { ISoil, ISoilResponse } from './types';

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
      transformResponse: (results: { data: { soil: ISoil[] } }) =>
        results.data.soil,
    }),
    calculateWaterDeficiency: builder.mutation<
      WaterDeficiencyResponse,
      WaterDeficiencyRequest
    >({
      query: (body) => ({
        url: '/soils/calculate-water-deficiency',
        method: 'POST',
        body,
      }),
    }),
    calculatePotentialEvapotranspiration: builder.mutation<
      PotentialEvapotranspirationResponse,
      PotentialEvapotranspirationRequest
    >({
      query: (body) => ({
        url: '/soils/calculate-potential-evapotranspiration',
        method: 'POST',
        body,
      }),
    }),
    getIdealTemperature: builder.mutation<
      IdealTemperatureResponse,
      IdealTemperatureRequest
    >({
      query: (body) => ({
        url: '/soils/get-ideal-temperature',
        method: 'POST',
        body,
      }),
    }),

    getIdealHumidity: builder.mutation<
      IdealHumidityResponse,
      IdealHumidityRequest
    >({
      query: (body) => ({
        url: '/soils/get-ideal-humidity',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {
  useGetSoilQuery,
  useGetSoilsMutation,
  useGetIdealHumidityMutation,
  useCalculateWaterDeficiencyMutation,
  useCalculatePotentialEvapotranspirationMutation,
  useGetIdealTemperatureMutation,
} = soilApi;
