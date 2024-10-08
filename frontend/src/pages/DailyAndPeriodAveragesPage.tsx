import { Alert, Box, Button, Container, Grid } from '@mui/material';
import React, { useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import DailyAndPeriodAveragesDataTable from '../components/DailyAndPeriodAveragesDataTable';
import FullScreenLoader from '../components/FullScreenLoader';
import Message from '../components/Message';
import PageTitle from '../components/PageTitle';
import { useGetAveragesQuery } from '../redux/api/metricApi';

interface DataItem {
  period: string;
  average_temperature: number;
  average_humidity: number;
}

const DailyAndPeriodAveragesPage: React.FC = () => {
  const { data, isLoading, isError } = useGetAveragesQuery(''); // Fetch the data

  const [viewType, setViewType] = useState<'chart' | 'grid'>('chart');

  if (isLoading) {
    return <FullScreenLoader />;
  }

  if (isError || !data) {
    return (
      <Box textAlign='center' mt={4}>
        <Alert severity='error'>Failed to fetch data</Alert>
      </Box>
    );
  }

  // Check if data is an array before using .map
  if (!Array.isArray(data)) {
    return (
      <Box textAlign='center' mt={4}>
        <Alert severity='warning'>No data available</Alert>
      </Box>
    );
  }

  const chartData = data.map((d) => ({
    period: d.period,
    average_temperature: d.average_temperature,
    average_humidity: d.average_humidity,
  }));

  const rows = data.map((d: DataItem, index: number) => ({
    id: index + 1,
    period: d.period,
    average_temperature: d.average_temperature,
    average_humidity: d.average_humidity,
  }));

  const handleViewChange = () => {
    setViewType((prevType) => (prevType === 'chart' ? 'grid' : 'chart'));
  };

  return (
    <Container
      maxWidth={false}
      sx={{ backgroundColor: '#fff', height: '100vh' }}
    >
      {data?.length === 0 ? (
        <Box maxWidth='sm' sx={{ mx: 'auto', py: '5rem' }}>
          <Message type='info' title='Info'>
            No Database Info at the moment
          </Message>
        </Box>
      ) : (
        <>
          <PageTitle title={'Média Diaria e por Período'} />

          <Box
            style={{
              height: 'auto',
              width: '100%',
              marginBottom: '50px',
            }}
          >
            <Box textAlign='right'>
              <Button
                sx={{ mb: 2, mt: 2 }}
                variant='contained'
                color='primary'
                size='medium'
                onClick={handleViewChange}
              >
                {viewType === 'chart'
                  ? 'Vizualizar como Tabela'
                  : 'Vizualizar como Gráfico'}
              </Button>
            </Box>
            {viewType === 'chart' ? (
              <Box sx={{ height: 400 }}>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart
                    data={chartData}
                    margin={{ top: 50, bottom: 30, left: 40, right: 10 }}
                  >
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='period' />
                    <YAxis />
                    <Tooltip />
                    <Legend
                      layout='horizontal'
                      verticalAlign='top'
                      align='center'
                    />
                    <Bar
                      dataKey='average_temperature'
                      fill='#1f77b4'
                      name='Avg Temperatura (°C)'
                    />
                    <Bar
                      dataKey='average_humidity'
                      fill='#ff7f0e'
                      name='Avg Umidade (%)'
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            ) : (
              <Grid container spacing={2} mt={4} mb={4}>
                <Container maxWidth={false}>
                  <DailyAndPeriodAveragesDataTable data={rows || []} />
                </Container>
              </Grid>
            )}
          </Box>
        </>
      )}
    </Container>
  );
};

export default DailyAndPeriodAveragesPage;
