import { Box, Button, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import { createColumnHelper } from '@tanstack/react-table';
import moment from 'moment';
import { useState } from 'react';
import MetricLineChart from '../components/MetricLineChart';
import PageTitle from '../components/PageTitle';
import ReusableSensorComponent from '../components/ReusableSensorComponent ';
import { useGetTemperaturesMutation } from '../redux/api/temperatureApi';
import { ITemperature } from '../redux/types/temperatureTypes';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  margin: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  overflow: 'hidden',
}));

const columnHelper = createColumnHelper<ITemperature>();

const temperatureColumns = [
  columnHelper.accessor('id', {
    header: 'ID',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('temperature', {
    header: 'Temperatura',
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

const temperatureFilterItems: { id: number; value: string }[] = [];

const temperatureSortItems = [
  { id: 0, value: 'id' },
  { id: 4, value: 'temperature' },
  { id: 5, value: 'created_at' },
  { id: 6, value: 'updated_at' },
];

const TemperaturePage = () => {
  const [viewType, setViewType] = useState('grid'); // State to manage the view type

  const [
    getTemperatures,
    {
      data: temperatureDataTable,
      isError: temperatureIsError,
      isLoading: temperatureIsLoading,
    },
  ] = useGetTemperaturesMutation();

  const handleViewChange = () => {
    setViewType((prevType) => (prevType === 'grid' ? 'kanban' : 'grid'));
  };
  return (
    <>
      {' '}
      <Box
        textAlign='right'
        display='flex'
        justifyContent='space-between'
        alignItems='center'
      >
        <Button
          // fullWidth
          sx={{ mb: 2, mt: 2 }}
          variant='contained'
          color='primary'
          size='small'
          onClick={handleViewChange} // Function to toggle between views
        >
          {viewType === 'grid' ? 'Vizualizar Gráfico' : 'Vizualizar Tabela'}
        </Button>
      </Box>
      {viewType === 'grid' ? (
        <>
          <ReusableSensorComponent<ITemperature>
            title='Temperatura'
            getMutation={getTemperatures}
            filterType=''
            filterItems={temperatureFilterItems}
            sortItems={temperatureSortItems}
            columns={temperatureColumns}
          />
        </>
      ) : (
        <>
          {viewType === 'kanban' && <PageTitle title={'Temperatura'} />}
          {/* TemperatureLineChart */}
          <Item>
            <MetricLineChart
              width={1000}
              height={400}
              isLoading={temperatureIsLoading}
              isError={temperatureIsError}
              data={temperatureDataTable ?? []}
              dataKey='id'
              valueField='temperature'
              unit='°C'
              chartTitle='Temperatura'
              color='red'
            />
          </Item>
        </>
      )}
    </>
  );
};

export default TemperaturePage;
