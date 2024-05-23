import { Alert, Box, Button, Container, Grid, Typography } from '@mui/material';
import { BarChart } from '@mui/x-charts';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import React, { useState } from 'react';
import FullScreenLoader from '../components/FullScreenLoader';
import Message from '../components/Message';
import { useGetDailyAndPeriodAveragesQuery } from '../redux/api/sensorApi';

interface DataItem {
  period: string;
  average_temperature: number;
  average_humidity: number;
}

const DailyAndPeriodAveragesPage: React.FC = () => {
  const { data, isLoading, isError } = useGetDailyAndPeriodAveragesQuery(); // Fetch the data

  const [viewType, setViewType] = useState<'chart' | 'grid'>('chart');

  if (isLoading) {
    return <FullScreenLoader />;
  }

  if (isError || !data) {
    return (
      <Box textAlign='center' mt={4}>
        <Alert severity='error'>Failed to fetch data</Alert>{' '}
        {/* Show an error message */}
      </Box>
    );
  }

  // Check if data is an array before using .map
  if (!Array.isArray(data)) {
    return (
      <Box textAlign='center' mt={4}>
        <Alert severity='warning'>No data available</Alert>{' '}
        {/* Show a warning if data isn't as expected */}
      </Box>
    );
  }

  const periods = data?.map((d) => d.period) || [];
  const temperatureData = data?.map((d) => d.average_temperature) || [];
  const humidityData = data?.map((d) => d.average_humidity) || [];

  const xAxis = [
    {
      type: 'band' as const,
      data: Array.isArray(periods) ? periods : [],
      scaleType: 'band' as const,
    },
  ];

  const series = [
    {
      label: 'Avg Temperatura (°C)',
      data: temperatureData,
    },
    {
      label: 'Avg Umidade (%)',
      data: humidityData,
    },
  ];

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'period', headerName: 'Período', width: 150 },
    {
      field: 'average_temperature',
      headerName: 'Avg Temperatura (°C)',
      width: 180,
    },
    { field: 'average_humidity', headerName: 'Avg Umidade (%)', width: 150 },
  ];

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
          <Box
            sx={{
              backgroundColor: '#ece9e9',
              // mt: '2rem',
              height: '15rem',
              display: 'flex',
              textAlign: 'center',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography
              variant='h2'
              component='h1'
              sx={{
                color: '#1f1e1e',
                fontWeight: 500,
                marginLeft: 1,
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.25)',
                  transformOrigin: 'center center', // Change transform origin to right side
                },
              }}
            >
              {/* Average Temperature and Humidity by Period */}
              Média Diaria e por Período
            </Typography>
          </Box>
          <div style={{ float: 'right' }}>
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
          </div>
          {viewType === 'chart' ? (
            <BarChart
              xAxis={xAxis}
              series={series}
              height={300}
              margin={{ top: 20, bottom: 30, left: 40, right: 10 }}
              colors={['#1f77b4', '#ff7f0e']} // Distinct colors for temperature and humidity
            />
          ) : (
            <Grid container spacing={2} mb={4}>
              <DataGrid
                autoHeight
                getRowId={(row) => row.id}
                rows={rows ?? []}
                columns={columns}
                checkboxSelection
                pagination
                rowHeight={30}
                pageSizeOptions={[5, 10, 20, 40, 80, 100]}
              />
            </Grid>
          )}
        </>
      )}
    </Container>
  );
};

export default DailyAndPeriodAveragesPage; // Export the component for use in your app
