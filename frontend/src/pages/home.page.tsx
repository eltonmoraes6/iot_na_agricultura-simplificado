import { Box, Button, Container, Grid, Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useState } from 'react';
import HumidityLineChart from '../components/sensor/HumidityLineChart';
import TemperatureLineChart from '../components/sensor/TemperatureLineChart';

import HumidityGauge from '../components/sensor/HumidityGauge';
import TemperatureGauge from '../components/sensor/TemperatureGauge';

import moment from 'moment';
import Filter from '../components/Filter';
import FullScreenLoader from '../components/FullScreenLoader';
import Message from '../components/Message';
import PageTitle from '../components/PageTitle';
import DataTable from '../components/sensor/DataTable';
import {
  useGetAllSensorsQuery,
  useGetSensorsMutation,
} from '../redux/api/sensorApi';
import { ISensor, PaginationModel } from '../redux/api/types';
import { filterItems, sortItem } from '../utils/filterInfo';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  margin: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const Home = () => {
  // Define states for filter criteria, pagination, sorting, and selection
  const [seasonFilter, setSeasonFilter] = useState('');
  const [sort, setSort] = useState('');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('ASC');
  const [fields, setFields] = useState('');
  const [paginationModel, setPaginationModel] = useState<PaginationModel>({
    page: 0,
    pageSize: 10,
  });

  const [viewType, setViewType] = useState('grid'); // State to manage the view type
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

  const handleViewChange = () => {
    setViewType((prevType) => (prevType === 'grid' ? 'kanban' : 'grid'));
  };

  return (
    <>
      <PageTitle title={'Filtro de Dados'} />

      <Box
        style={{
          height: 'auto',
          width: '100%',
          marginBottom: '50px',
        }}
      >
        <Box textAlign='right'>
          <Button
            // fullWidth
            sx={{ mb: 2, mt: 2 }}
            variant='contained'
            color='primary'
            size='medium'
            onClick={handleViewChange} // Function to toggle between views
          >
            {viewType === 'grid'
              ? 'Vizualizar como Tabela'
              : 'Vizualizar como Gráfico'}
          </Button>
        </Box>
        <Filter
          filterItem={filterItems}
          filter={seasonFilter}
          setFilter={setSeasonFilter}
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

        {viewType === 'grid' ? (
          <Container
            maxWidth={false}
            sx={{ backgroundColor: '#fff', height: '100vh' }}
          >
            {dataToDisplay?.length === 0 ? (
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
                  <Grid item sm={12} xs={8} md={6}>
                    <Item>
                      <HumidityLineChart
                        sensors={dataToDisplay ?? []}
                        isError={allSensorsError}
                        isLoading={allSensorsLoading}
                      />
                    </Item>
                  </Grid>
                  <Grid item sm={12} xs={8} md={6}>
                    <Item>
                      <TemperatureLineChart
                        sensors={dataToDisplay ?? []}
                        isError={allSensorsError}
                        isLoading={allSensorsLoading}
                      />
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
                      <HumidityGauge
                        sensors={allSensorsData ?? []}
                        isError={allSensorsError}
                        isLoading={allSensorsLoading}
                      />
                    </Item>
                  </Grid>
                  <Grid item sm={12} xs={8} md={6}>
                    <Item>
                      <TemperatureGauge
                        sensors={allSensorsData ?? []}
                        isError={allSensorsError}
                        isLoading={allSensorsLoading}
                      />
                    </Item>
                  </Grid>
                </Grid>
              </>
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

export default Home;
