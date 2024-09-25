import { Typography } from '@mui/material';
import { createColumnHelper } from '@tanstack/react-table';
import moment from 'moment';
import { useEffect, useMemo } from 'react';
import FullScreenLoader from '../components/FullScreenLoader';
import ReusableSensorComponent from '../components/ReusableSensorComponent ';
import { useGetMetricsMutation } from '../redux/api/metricApi';
import { IMetric } from '../redux/types/metricTypes';

const columnHelper = createColumnHelper<IMetric>();

const soilColumns = [
  columnHelper.accessor('id', {
    header: 'ID',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('minTemperature', {
    header: 'Temperatura Mínima',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('maxTemperature', {
    header: 'Temperatura Máxima',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('minHumidity', {
    header: 'Umidade Mínima',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('maxHumidity', {
    header: 'Umidade Máxima',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('soilType', {
    header: 'Tipo de Solo',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('season', {
    header: 'Estação do Ano',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('created_at', {
    header: 'Criação',
    cell: (info) => moment(info.getValue()).format('DD/MM/YYYY HH:mm:ss'), // Format using moment
  }),
  columnHelper.accessor('updated_at', {
    header: 'Edição',
    cell: (info) => moment(info.getValue()).format('DD/MM/YYYY HH:mm:ss'), // Format using moment
  }),
];

const metricsFilterItems: { id: number; value: string }[] = [];

const sortItems = [
  { id: 0, value: 'id' },
  { id: 5, value: 'created_at' },
  { id: 6, value: 'updated_at' },
];

const MetricsPage = () => {
  const [getMetrics, { data: metricsData, isError, isLoading }] =
    useGetMetricsMutation();

  const metricsDataToDisplay = metricsData;

  const metricsDataTable: IMetric[] = useMemo(() => {
    return (
      metricsDataToDisplay?.map((item) => ({
        ...item,
      })) ?? []
    );
  }, [metricsDataToDisplay]);

  useEffect(() => {
    console.log(metricsDataTable);
  }, [metricsDataTable]);
  return (
    <>
      {isError && (
        <Typography color='error'>An unexpected error occurred</Typography>
      )}
      {isLoading && <FullScreenLoader />}
      <ReusableSensorComponent<IMetric>
        title='Métricas'
        getMutation={getMetrics}
        filterType='soilType'
        filterItems={metricsFilterItems}
        sortItems={sortItems}
        columns={soilColumns}
      />
    </>
  );
};

export default MetricsPage;
