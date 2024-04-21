import { Box, Container, Typography } from '@mui/material';

import { useEffect } from 'react';
import { toast } from 'react-toastify';
import FullScreenLoader from '../components/FullScreenLoader';
import Message from '../components/Message';
import SensorDataBarChart from '../components/sensor/bar';
import { useGetAllSensorsQuery } from '../redux/api/sensorApi';

const SeasonDataBarChart = () => {
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
            No Season Data at the moment
          </Message>
        </Box>
      ) : (
        <>
          <Box
            sx={{
              backgroundColor: '#ece9e9',
              mt: '2rem',
              height: '15rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography
              variant='h2'
              component='h1'
              sx={{ color: '#1f1e1e', fontWeight: 500 }}
            >
              Season Data Bar Chart
            </Typography>
          </Box>
          <Box sx={{ height: 400, width: '100%' }}>
            <SensorDataBarChart sensorData={sensors} />
          </Box>
        </>
      )}
    </Container>
  );
};

export default SeasonDataBarChart;
