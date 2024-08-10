import { Alert, Box, Button, Container, Grid, Typography } from '@mui/material';
import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import moment from 'moment';
import { useState } from 'react';
import SensorFilter from '../components/Filter';
import FullScreenLoader from '../components/FullScreenLoader';
import Message from '../components/Message';
import PageTitle from '../components/PageTitle';
import DataTable from '../components/sensor/DataTable';
import SensorDataBarChart from '../components/sensor/SensorDataBarChart';
import { useGetSensorsMutation } from '../redux/api/sensorApi';
import { ISensor, PaginationModel } from '../redux/api/types';
import { filterItems, sortItem } from '../utils/filterInfo';

const SeasonDataBarChart = () => {
  // Define states for filter criteria, pagination, sorting, and selection

  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState('created_at'); // Default sort field
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('ASC');
  const [fields, setFields] = useState('');
  const [paginationModel, setPaginationModel] = useState<PaginationModel>({
    page: 0,
    pageSize: 10,
  });
  const [filteredData, setFilteredData] = useState<ISensor[] | null>(null);
  const [viewType, setViewType] = useState<'chart' | 'grid'>('chart');

  const [getSensors, { isLoading: sensorsLoading, error: sensorsFetchError }] =
    useGetSensorsMutation();

  const handleFilter = async () => {
    const { page, pageSize } = paginationModel;
    const pageNumber = page + 1;
    let queryString = `limit=${pageSize}&page=${pageNumber}&sortOrder=${sortOrder}&sort=${sort}&fields=${fields}`;

    if (filter) {
      queryString += `&season=${filter}`;
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

  if (sensorsLoading) {
    return <FullScreenLoader />;
  }

  const error = sensorsFetchError;

  const getErrorMessage = (error: FetchBaseQueryError | SerializedError) => {
    if ('status' in error) {
      const result = error.data as { message?: string };
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

  const dataToDisplay = filteredData;

  // Convert data to IDataTable format for DataTable component
  const dataTableData =
    dataToDisplay?.map((sensor) => ({
      id: sensor.id,
      temperature: sensor.temperature,
      season: sensor.season,
      humidity: sensor.humidity,
      created_at: moment(sensor.created_at).format('DD/MM/YYYY'),
      updated_at: moment(sensor.updated_at).format('DD/MM/YYYY'),
    })) ?? [];

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
      <PageTitle title={'Gráfico de Dados - Estações do Ano'} />

      <Box style={{ height: 'auto', width: '100%', marginBottom: '50px' }}>
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
        <SensorFilter
          filterItem={filterItems}
          filter={filter}
          setFilter={setFilter}
          sort={sort}
          sortItem={sortItem}
          setSort={setSort}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          fields={fields}
          setFields={setFields}
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
            <Container maxWidth={false}>
              <DataTable data={dataTableData || []} />
            </Container>
          </Grid>
        )}
      </Box>
    </>
  );
};

export default SeasonDataBarChart;
