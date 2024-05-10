import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Typography,
} from '@mui/material';
import { BarChart } from '@mui/x-charts';
import React from 'react';
import Message from '../components/Message';
import { useGetDailyAndPeriodAveragesQuery } from '../redux/api/sensorApi';

const DailyAndPeriodAveragesPage: React.FC = () => {
  const { data, isLoading, isError } = useGetDailyAndPeriodAveragesQuery(); // Fetch the data

  if (isLoading) {
    return (
      <Box textAlign='center' mt={4}>
        <CircularProgress /> {/* Show a loading spinner */}
      </Box>
    );
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
      label: 'Avg Temperature (°C)',
      data: temperatureData,
    },
    {
      label: 'Avg Humidity (%)',
      data: humidityData,
    },
  ];

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
              sx={{ color: '#1f1e1e', fontWeight: 500 }}
            >
              {/* Average Temperature and Humidity by Period */}
              Média Diaria e por Periodo (Temperatura e Umidade)
            </Typography>
          </Box>

          <BarChart
            xAxis={xAxis}
            series={series}
            height={300}
            margin={{ top: 20, bottom: 30, left: 40, right: 10 }}
            colors={['#1f77b4', '#ff7f0e']} // Distinct colors for temperature and humidity
          />
        </>
      )}
    </Container>
  );
};

export default DailyAndPeriodAveragesPage; // Export the component for use in your app
