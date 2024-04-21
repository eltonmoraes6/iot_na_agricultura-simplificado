import { Box, Container, Grid, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

import { useEffect } from 'react';
import { toast } from 'react-toastify';
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
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const HomePage = () => {
  const { isLoading, isError, error, data: sensors } = useGetAllSensorsQuery();

  useEffect(() => {
    if (isError) {
      if (Array.isArray((error as any).data.error)) {
        (error as any).data.error.forEach((el: any) =>
          toast.error(el.message, {
            position: 'top-right',
          })
        );
      } else {
        toast.error((error as any).data.message, {
          position: 'top-right',
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  if (isLoading) {
    return <FullScreenLoader />;
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
          <Box sx={{ height: 400, width: '100%' }}>
            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              <Grid item xs={6}>
                <Item>
                  <TemperatureLineChart />
                </Item>
              </Grid>
              <Grid item xs={6}>
                <Item>
                  <HumidityLineChart />
                </Item>
              </Grid>
            </Grid>
          </Box>
          {/* Gauge */}
          <Box sx={{ height: 400, width: '100%' }}>
            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              <Grid item xs={6}>
                <Item>
                  <TemperatureGauge />
                </Item>
              </Grid>
              <Grid item xs={6}>
                <Item>
                  <HumidityGauge />
                </Item>
              </Grid>
            </Grid>
          </Box>
        </>
      )}
    </Container>
  );
};

export default HomePage;
