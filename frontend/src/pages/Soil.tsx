import { Box, Button, Container, Grid, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import SensorFilter from '../components/Filter';
import FullScreenLoader from '../components/FullScreenLoader';
import PageTitle from '../components/PageTitle';
import Calculate from '../components/soil/Calculate';
import SoilDataTable from '../components/soil/SoilDataTable';
import { useGetOneSensorQuery } from '../redux/api/sensorApi';
import { useGetSoilsMutation } from '../redux/api/soilApi';
import { ISoil, PaginationModel } from '../redux/api/types';
import { FilterItem, SortItem } from '../utils/types';

const filterItems: FilterItem[] = [
  { id: 1, value: 'Latossolos' },
  { id: 2, value: 'Argissolos' },
  { id: 3, value: 'Neossolos' },
];

const sortItem: SortItem[] = [
  { id: 0, value: 'id' },
  { id: 1, value: 'soilType' },
  { id: 2, value: 'minHumidity' },
  { id: 3, value: 'maxHumidity' },
  { id: 4, value: 'minTemperature' },
  { id: 5, value: 'created_at' },
  { id: 6, value: 'updated_at' },
  { id: 7, value: 'sensor ' },
];

const Soil = () => {
  const [filteredData, setFilteredData] = useState<ISoil[] | null>(null);
  const [viewType, setViewType] = useState('grid'); // State to manage the view type

  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState('');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('ASC');
  const [fields, setFields] = useState('');
  const [paginationModel, setPaginationModel] = useState<PaginationModel>({
    page: 0,
    pageSize: 10,
  });

  const { data: OneSensorData } = useGetOneSensorQuery('');

  if (OneSensorData) console.log(OneSensorData[0].temperature);

  const [getSoils, { isLoading: soilsLoading, error: soilsError }] =
    useGetSoilsMutation();

  const fetchSoils = useCallback(
    async (queryString: string) => {
      try {
        const result = (await getSoils(queryString).unwrap()) as ISoil[];
        if (result) {
          setFilteredData(result);
        }
      } catch (error) {
        console.error('Error fetching filtered data:', error);
      }
    },
    [getSoils]
  );

  useEffect(() => {
    const { page, pageSize } = paginationModel;
    const pageNumber = page + 1;
    let queryString = `limit=${pageSize}&page=${pageNumber}&sortOrder=${sortOrder}&sort=${sort}&fields=${fields}`;

    if (filter) {
      queryString += `&soilType=${filter}`;
    }

    fetchSoils(queryString);
  }, [filter, sort, sortOrder, fields, paginationModel, fetchSoils]);

  const handleFilter = () => {
    const { page, pageSize } = paginationModel;
    const pageNumber = page + 1;
    let queryString = `limit=${pageSize}&page=${pageNumber}&sortOrder=${sortOrder}&sort=${sort}&fields=${fields}`;
    if (filter) {
      queryString += `&soilType=${filter}`;
    }

    fetchSoils(queryString);
  };

  if (soilsLoading) {
    return <FullScreenLoader />;
  }

  if (soilsError) {
    return <Typography color='error'>An unexpected error occurred</Typography>;
  }

  const dataToDisplay = filteredData;

  const dataTableData =
    dataToDisplay?.map((soil) => ({
      id: soil.id,
      minTemperature: soil.minTemperature,
      maxTemperature: soil.maxTemperature,
      minHumidity: soil.minHumidity,
      maxHumidity: soil.maxHumidity,
      soilType: soil.soilType,
      created_at: soil.created_at,
      updated_at: soil.updated_at,
      sensor: soil.sensor,
    })) ?? [];

  console.log('dataTableData =====> ', dataTableData);

  const handleViewChange = () => {
    setViewType((prevType) => (prevType === 'grid' ? 'kanban' : 'grid'));
  };

  return (
    <>
      <PageTitle title={'Métricas'} />

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
        {viewType === 'grid' ? (
          <Container
            maxWidth={false}
            sx={{ backgroundColor: '#fff', height: '100vh' }}
          >
            <Grid container spacing={2} mb={4}>
              <Grid
                container
                rowSpacing={1}
                columnSpacing={{ xs: 1, sm: 2, md: 3 }}
              >
                <Calculate
                  soilType={dataTableData[0]?.soilType || 'Latossolos'}
                  temperature={OneSensorData ? OneSensorData[0].temperature : 0}
                />
              </Grid>
            </Grid>
          </Container>
        ) : (
          <Grid container spacing={2} mb={4}>
            <Container maxWidth={false}>
              <SoilDataTable data={dataTableData || []} />
            </Container>
          </Grid>
        )}
      </Box>
    </>
  );
};

export default Soil;
