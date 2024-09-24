import { Box, Container, Grid } from '@mui/material';
import PageTitle from '../components/PageTitle';
import HumidityPage from './Humidity.page';
import SeasonPage from './Season.page';
import SoilPage from './Soil.page';
import TemperaturePage from './Temperature.page';

const DatabaseInfo = () => {
  return (
    <>
      <PageTitle title={'Banco de Dados'} />
      <br />
      <br />
      <br />
      <Box
        style={{
          height: 'auto',
          width: '100%',
          marginBottom: '50px',
        }}
      >
        <Grid container spacing={2} mb={4}>
          <Container maxWidth={false}>
            <TemperaturePage />
            <HumidityPage />
            <SeasonPage />
            <SoilPage />
          </Container>
        </Grid>
      </Box>
    </>
  );
};

export default DatabaseInfo;
