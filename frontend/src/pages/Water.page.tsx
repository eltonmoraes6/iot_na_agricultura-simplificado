import { Box, Button, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import { createColumnHelper } from '@tanstack/react-table';
import moment from 'moment';
import { useState } from 'react';
import MetricLineChart from '../components/MetricLineChart';
import PageTitle from '../components/PageTitle';
import ReusableSensorComponent from '../components/ReusableSensorComponent ';
import { useGetWaterFlowMutation } from '../redux/api/waterFlow';
import { IWaterFlow } from '../redux/types/waterFlowTypes';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  margin: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  overflow: 'hidden',
}));

const columnHelper = createColumnHelper<IWaterFlow>();

const waterFlowColumns = [
  columnHelper.accessor('id', {
    header: 'ID',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('isIrrigated', {
    header: 'Irrigando',
    cell: (info) => (info.getValue() ? 'Sim' : 'Não'), // Convert to string
  }),
  columnHelper.accessor('startIrrigationTime', {
    header: 'Horário de partida',
    cell: (info) =>
      info.getValue()
        ? moment(info.getValue()).format('DD/MM/YYYY HH:mm:ss')
        : 'Não definido', // Check if value exists and format using moment
  }),
  columnHelper.accessor('stopIrrigationTime', {
    header: 'Horário de parada',
    cell: (info) =>
      info.getValue()
        ? moment(info.getValue()).format('DD/MM/YYYY HH:mm:ss')
        : 'Não definido', // Check if value exists and format using moment
  }),
  columnHelper.accessor('totalWaterUsed', {
    header: 'Total de Água Utilizada',
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

const waterFlowFilterItems: { id: number; value: string }[] = [];

const waterFlowSortItems = [
  { id: 0, value: 'id' },
  { id: 5, value: 'created_at' },
  { id: 6, value: 'updated_at' },
];

const WaterPage = () => {
  const [viewType, setViewType] = useState('grid'); // State to manage the view type

  const [
    getWaterFlow,
    {
      data: waterFlowDataTable,
      isError: waterFlowIsError,
      isLoading: waterFlowIsLoading,
    },
  ] = useGetWaterFlowMutation();

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
          <ReusableSensorComponent<IWaterFlow>
            title='Fluxo de água'
            getMutation={getWaterFlow}
            filterType=''
            filterItems={waterFlowFilterItems}
            sortItems={waterFlowSortItems}
            columns={waterFlowColumns}
          />
        </>
      ) : (
        <>
          {viewType === 'kanban' && <PageTitle title={'Fluxo de água'} />}
          {/* WaterFlowLineChart */}
          <Item>
            <MetricLineChart
              width={1000}
              height={400}
              isLoading={waterFlowIsLoading}
              isError={waterFlowIsError}
              data={waterFlowDataTable ?? []}
              dataKey='id'
              valueField='waterFlowRate'
              unit='%'
              chartTitle='Fluxo de Água'
              color='red'
            />
          </Item>

          <Item>
            <MetricLineChart
              width={1000}
              height={400}
              isLoading={waterFlowIsLoading}
              isError={waterFlowIsError}
              data={waterFlowDataTable ?? []}
              dataKey='id'
              valueField='totalWaterUsed'
              unit='%'
              chartTitle='Total de Água Usado'
              color='red'
            />
          </Item>
        </>
      )}
    </>
  );
};

export default WaterPage;
