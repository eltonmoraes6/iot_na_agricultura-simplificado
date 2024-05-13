import { Alert, Box, Container, Typography } from '@mui/material';

import FullScreenLoader from '../components/FullScreenLoader';
import Message from '../components/Message';
import SensorDataBarChart from '../components/sensor/SensorDataBarChart';
import { useGetAllSensorsQuery } from '../redux/api/sensorApi';

const SeasonDataBarChart = () => {
  const { isLoading, isError, error, data: sensors } = useGetAllSensorsQuery();

  const formattedSensors =
    sensors?.map((sensor) => ({
      ...sensor,
      temperature: sensor.temperature.toString(), // Convert to string
    })) || [];

  if (isLoading) {
    return <FullScreenLoader />;
  }

  if (isError || !sensors) {
    return (
      <Box textAlign='center' mt={4}>
        <Alert severity='error'>Failed to fetch data</Alert>{' '}
        {/* Show an error message */}
      </Box>
    );
  }

  // Check if data is an array before using .map
  if (!Array.isArray(sensors)) {
    return (
      <Box textAlign='center' mt={4}>
        <Alert severity='warning'>No data available</Alert>
        <Typography
          variant='h2'
          component='h1'
          sx={{ color: '#1f1e1e', fontWeight: 500 }}
        >
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Container
      maxWidth={false}
      sx={{ backgroundColor: '#fff', height: '100vh' }}
    >
      {sensors?.length === 0 ? (
        <Box maxWidth='sm' sx={{ mx: 'auto', py: '5rem' }}>
          <Message type='info' title='Info'>
            No Season Data at the moment
          </Message>
        </Box>
      ) : (
        <>
          <Box
            sx={{
              backgroundColor: '#ece9e9',
              textAlign: 'center',
              // mt: '2rem',
              height: '15rem',
              display: 'flex',
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
              {/* Season Data Bar Chart */}
              Gráfico de Dados - Estações do Ano
            </Typography>
          </Box>
          <Box sx={{ height: 400, width: '100%' }}>
            <SensorDataBarChart sensorData={formattedSensors} />
          </Box>
        </>
      )}
    </Container>
  );
};

export default SeasonDataBarChart;
