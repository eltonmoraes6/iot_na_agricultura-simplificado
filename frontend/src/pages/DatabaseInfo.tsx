import { Box, Container, Grid, Typography } from '@mui/material';
import { useState } from 'react';

import moment from 'moment';
import FullScreenLoader from '../components/FullScreenLoader';
import DataTable from '../components/sensor/DataTable';
import SensorFilter from '../components/sensor/SensorFilter';
import {
  useGetAllSensorsQuery,
  useGetSensorsMutation,
} from '../redux/api/sensorApi';
import { ISensor } from '../redux/api/types';

const DatabaseInfo = () => {
  // Define states for filter criteria, pagination, sorting, and selection
  const [seasonFilter, setSeasonFilter] = useState('');
  const [paginationModel, setPaginationModel] = useState({
    page: 0, // Note: DataGrid uses zero-based indexing
    pageSize: 10,
  });
  const [filteredData, setFilteredData] = useState<ISensor[] | null>(null);
  // Load initial data with the query hook
  const {
    data: allSensorsData,
    error: allSensorsError,
    isLoading: allSensorsLoading,
  } = useGetAllSensorsQuery();

  // Use the mutation hook to fetch filtered data
  const [getSensors, { isLoading: sensorsLoading, error: sensorsError }] =
    useGetSensorsMutation();

  const handleFilter = async () => {
    const { page, pageSize } = paginationModel;

    // Convert 0-based index to 1-based for server-side pagination
    const pageNumber = page + 1;

    let queryString = `limit=${pageSize}&page=${pageNumber}`;

    if (seasonFilter) {
      queryString += `&season=${seasonFilter}`;
    }

    try {
      const result = (await getSensors(queryString).unwrap()) as ISensor[];
      if (result) {
        setFilteredData(result); // Store filtered data in state
      }
    } catch (error) {
      console.error('Error fetching filtered data:', error);
    }
  };

  // Render loading state
  if (allSensorsLoading || sensorsLoading) {
    return <FullScreenLoader />;
  }

  // Handle errors from both the initial query and the mutation
  if (allSensorsError || sensorsError) {
    const error = allSensorsError || sensorsError;
    if (error) {
      return (
        <Typography color='error'>An unexpected error occurred</Typography>
      );
    }
  }

  // Determine which data set to use for the DataGrid
  const dataToDisplay = filteredData ?? allSensorsData;

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

  return (
    <>
      <Box
        sx={{
          backgroundColor: '#ece9e9',
          // mt: '2rem',
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
              transformOrigin: 'center center', // Change transform origin to right side
            },
          }}
        >
          Banco de Dados
        </Typography>
      </Box>
      <SensorFilter
        seasonFilter={seasonFilter}
        setSeasonFilter={setSeasonFilter}
        paginationModel={paginationModel}
        setPaginationModel={setPaginationModel}
        handleFilter={handleFilter}
      />

      <Box
        style={{
          height: 'auto',
          width: '100%',
          marginBottom: '50px',
        }}
      >
        <Grid container spacing={2} mb={4}>
          <Container maxWidth={false}>
            <DataTable data={dataTableData || []} />
          </Container>
        </Grid>
      </Box>
    </>
  );
};

export default DatabaseInfo;
