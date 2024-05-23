import { Alert, Box, Button, Container, Grid, Typography } from '@mui/material';
import { useState } from 'react';

import { DataGrid } from '@mui/x-data-grid';
import FullScreenLoader from '../components/FullScreenLoader';
import Message from '../components/Message';
import SensorDataBarChart from '../components/sensor/SensorDataBarChart';
import SensorFilter from '../components/sensor/SensorFilter';
import {
  useGetAllSensorsQuery,
  useGetSensorsMutation,
} from '../redux/api/sensorApi';
import { ISensor } from '../redux/api/types';

import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import columns from './columns';

const SeasonDataBarChart = () => {
  const [seasonFilter, setSeasonFilter] = useState('');
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [filteredData, setFilteredData] = useState<ISensor[] | null>(null);
  const [viewType, setViewType] = useState('chart');

  const {
    isLoading: allSensorsLoading,
    // isError: allSensorsError,
    error: allSensorsFetchError,
    data: allSensorsData,
  } = useGetAllSensorsQuery();
  const [getSensors, { isLoading: sensorsLoading, error: sensorsFetchError }] =
    useGetSensorsMutation();

  const handleFilter = async () => {
    const { page, pageSize } = paginationModel;
    const pageNumber = page + 1;
    let queryString = `limit=${pageSize}&page=${pageNumber}`;

    if (seasonFilter) {
      queryString += `&season=${seasonFilter}`;
    }

    try {
      const result: ISensor[] = await getSensors(queryString).unwrap();
      if (result) {
        setFilteredData(result);
      }
    } catch (error) {
      console.error('Error fetching filtered data:', error);
    }
  };

  if (allSensorsLoading || sensorsLoading) {
    return <FullScreenLoader />;
  }

  const error = allSensorsFetchError || sensorsFetchError;

  const getErrorMessage = (error: FetchBaseQueryError | SerializedError) => {
    if ('status' in error) {
      const result = error.data as { message?: string }; // Assert the type of error.data
      return result?.message || 'An unexpected error occurred';
    }
    return error.message || 'An unexpected error occurred';
  };

  if (error) {
    return (
      <Box textAlign='center' mt={4}>
        <Alert severity='error'>Failed to fetch data</Alert>
        <Typography
          variant='h2'
          component='h1'
          sx={{ color: '#1f1e1e', fontWeight: 500 }}
        >
          {getErrorMessage(error)}
        </Typography>
      </Box>
    );
  }

  const dataToDisplay = filteredData ?? allSensorsData;
  const formattedSensors =
    dataToDisplay?.map((sensor) => ({
      ...sensor,
      temperature: sensor.temperature.toString(),
    })) || [];

  const handleViewChange = () => {
    setViewType((prevType) => (prevType === 'chart' ? 'grid' : 'chart'));
  };

  return (
    <>
      <Box
        sx={{
          backgroundColor: '#ece9e9',
          height: '15rem',
          textAlign: 'center',
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
              transformOrigin: 'center center',
            },
          }}
        >
          Gráfico de Dados - Estações do Ano
        </Typography>
      </Box>

      <Box style={{ height: 'auto', width: '100%', marginBottom: '50px' }}>
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
        <SensorFilter
          seasonFilter={seasonFilter}
          setSeasonFilter={setSeasonFilter}
          paginationModel={paginationModel}
          setPaginationModel={setPaginationModel}
          handleFilter={handleFilter}
        />

        {viewType === 'chart' ? (
          <Container
            maxWidth={false}
            sx={{ backgroundColor: '#fff', height: '100vh' }}
          >
            {formattedSensors.length === 0 ? (
              <Box maxWidth='sm' sx={{ mx: 'auto', py: '5rem' }}>
                <Message type='info' title='Info'>
                  No Season Data at the moment
                </Message>
              </Box>
            ) : (
              <Box sx={{ height: 400, width: '100%' }}>
                <SensorDataBarChart sensorData={formattedSensors} />
              </Box>
            )}
          </Container>
        ) : (
          <Grid container spacing={2} mb={4}>
            <DataGrid
              autoHeight
              getRowId={(row) => row.id}
              rows={dataToDisplay ?? []}
              columns={columns}
              checkboxSelection
              pagination
              rowHeight={30}
              pageSizeOptions={[5, 10, 20, 40, 80, 100]}
              // paginationModel={paginationModel}
              onPaginationModelChange={(newModel) =>
                setPaginationModel(newModel)
              }
            />
          </Grid>
        )}
      </Box>
    </>
  );
};

export default SeasonDataBarChart;
