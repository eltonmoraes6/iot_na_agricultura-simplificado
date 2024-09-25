import { Box, Button, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import { createColumnHelper } from '@tanstack/react-table';
import { useState } from 'react';
import MetricLineChart from '../components/MetricLineChart';
import PageTitle from '../components/PageTitle';
import ReusableSensorComponent from '../components/ReusableSensorComponent ';
import { useGetHumiditiesMutation } from '../redux/api/humidityApi';
import { IHumidity } from '../redux/types/humidityTypes';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  margin: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  overflow: 'hidden',
}));

const columnHelper = createColumnHelper<IHumidity>();

const humidityColumns = [
  columnHelper.accessor('id', {
    header: 'ID',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('humidity', {
    header: 'Umidade',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('created_at', {
    header: 'Criação',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('updated_at', {
    header: 'Edição',
    cell: (info) => info.getValue(),
  }),
];

const humidityFilterItems: { id: number; value: string }[] = [];

const humiditySortItems = [
  { id: 0, value: 'id' },
  { id: 4, value: 'humidity' },
  { id: 5, value: 'created_at' },
  { id: 6, value: 'updated_at' },
];

const HumidityPage = () => {
  const [viewType, setViewType] = useState('grid'); // State to manage the view type

  const [
    getHumidities,
    {
      data: humidityDataTable,
      isError: humidityIsError,
      isLoading: humidityIsLoading,
    },
  ] = useGetHumiditiesMutation();

  const handleViewChange = () => {
    setViewType((prevType) => (prevType === 'grid' ? 'kanban' : 'grid'));
  };

  return (
    <>
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
          <ReusableSensorComponent<IHumidity>
            title='Umidade'
            getMutation={getHumidities}
            filterType=''
            filterItems={humidityFilterItems}
            sortItems={humiditySortItems}
            columns={humidityColumns}
          />
        </>
      ) : (
        <>
          {/* TemperatureLineChart */}
          {viewType === 'kanban' && <PageTitle title={'Umidade'} />}

          <Item>
            <MetricLineChart
              width={1000}
              height={400}
              isLoading={humidityIsLoading}
              isError={humidityIsError}
              data={humidityDataTable ?? []}
              dataKey='id'
              valueField='humidity'
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

export default HumidityPage;
