import { createApi } from '@reduxjs/toolkit/query/react';
import { IConfigSettings, ISettings } from '../types/settingsTypes';
import customFetchBase from './customFetchBase';

export const settingsApi = createApi({
  reducerPath: 'settingsApi',
  baseQuery: customFetchBase,
  tagTypes: ['LogSettings', 'ConfigSettings'],
  endpoints: (builder) => ({
    getConfigSettings: builder.query<IConfigSettings, string>({
      query() {
        return {
          url: `/settings/config`,
          credentials: 'include',
        };
      },
      transformResponse: (results: { data: { configData: IConfigSettings } }) =>
        results.data.configData,
      providesTags: (_result, _error, id) => [{ type: 'ConfigSettings', id }],
    }),
    getLogsSettings: builder.mutation<ISettings[], string>({
      query: (logType: string) => {
        return {
          url: `/settings/logs/${logType}`,
          credentials: 'include',
        };
      },
      transformResponse: (results: { data: { logs: ISettings[] } }) =>
        results.data.logs,
    }),
  }),
});

export const { useGetConfigSettingsQuery, useGetLogsSettingsMutation } =
  settingsApi;
