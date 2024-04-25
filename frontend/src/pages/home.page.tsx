import { Alert, Box, Container, Grid, Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import FullScreenLoader from '../components/FullScreenLoader';
import Message from '../components/Message';
import HumidityGauge from '../components/sensor/HumidityGauge';
import TemperatureGauge from '../components/sensor/TemperatureGauge';
import HumidityLineChart from '../components/sensor/humidity';
import TemperatureLineChart from '../components/sensor/temperature';
import { useGetAllSensorsQuery } from '../redux/api/sensorApi';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  margin: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const HomePage = () => {
  const { isLoading, isError, error, data: sensors } = useGetAllSensorsQuery();

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
            No posts at the moment
          </Message>
        </Box>
      ) : (
        <>
          {/* LineChart */}
          <Grid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          >
            <Grid sm={12} xs={8} md={6}>
              <Item>
                <TemperatureLineChart />
              </Item>
            </Grid>
            <Grid sm={12} xs={8} md={6}>
              <Item>
                <HumidityLineChart />
              </Item>
            </Grid>
          </Grid>
          {/* Gauge */}
          <Grid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          >
            <Grid item sm={12} xs={8} md={6}>
              <Item>
                <TemperatureGauge />
              </Item>
            </Grid>
            <Grid item sm={12} xs={8} md={6}>
              <Item>
                <HumidityGauge />
              </Item>
            </Grid>
          </Grid>
        </>
      )}
    </Container>
  );
};

export default HomePage;
