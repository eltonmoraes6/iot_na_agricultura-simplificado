import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Switch,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import HumidityLineChart from '../components/sensor/HumidityLineChart';
import TemperatureLineChart from '../components/sensor/TemperatureLineChart';

import OpacityIcon from '@mui/icons-material/Opacity';
import moment from 'moment';
import DataTable from '../components/DataTable';
import Filter from '../components/Filter';
import FullScreenLoader from '../components/FullScreenLoader';
import Message from '../components/Message';
import PageTitle from '../components/PageTitle';
// import ThermostatIcon from '@mui/icons-material/Thermostat';
import WaterIcon from '@mui/icons-material/Water';
// import WaterDamageIcon from '@mui/icons-material/WaterDamage';
import SoilDataTable from '../components/soil/SoilDataTable';
import Weather from '../components/weather/Weather';
import {
  useGetOneSensorQuery,
  useGetSensorsMutation,
} from '../redux/api/sensorApi';
import {
  useGetIdealHumidityMutation,
  useGetSoilsMutation,
} from '../redux/api/soilApi';
import { ISensor, ISoil, PaginationModel } from '../redux/api/types';
import { filterItems, sortItem } from '../utils/filterInfo';
import { FilterItem, SortItem } from '../utils/types';

import { createColumnHelper } from '@tanstack/react-table';
import SensorFilter from '../components/Filter';
import { GaugeChartComponent } from '../components/GaugeChartComponent';

import {
  useCalculatePotentialEvapotranspirationMutation,
  useCalculateWaterDeficiencyMutation,
  useGetIdealTemperatureMutation,
} from '../redux/api/soilApi';
const columnHelper = createColumnHelper<ISensor>();

const columns = [
  // columnHelper.accessor('id', {
  //   header: () => 'ID',
  //   cell: (info) => info.getValue(),
  // }),
  columnHelper.accessor('temperature', {
    header: () => 'Temperatura',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('humidity', {
    header: () => 'Umidade',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('season', {
    header: () => 'Estações do Ano',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('created_at', {
    header: () => 'Criação',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('updated_at', {
    header: () => 'Edição',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('soil', {
    header: () => 'Solo',
    cell: (info) => info.getValue()?.soilType || 'N/A',
  }),
  columnHelper.accessor('soil', {
    header: () => 'Umidade Máxima',
    cell: (info) => info.getValue()?.maxHumidity || 'N/A',
  }),
];

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  margin: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  overflow: 'hidden',
}));

const FloatingCard = styled(Paper)(({ theme }) => ({
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  zIndex: 1000,
  padding: theme.spacing(2),
  backgroundColor: theme.palette.primary.light,
  boxShadow: theme.shadows[5],
  maxHeight: '80vh',
  overflowY: 'auto',
}));

const soilFilterItems: FilterItem[] = [
  { id: 1, value: 'Latossolos' },
  { id: 2, value: 'Argissolos' },
  { id: 3, value: 'Neossolos' },
];

const soilSortItem: SortItem[] = [
  { id: 0, value: 'id' },
  { id: 1, value: 'soilType' },
  { id: 2, value: 'minHumidity' },
  { id: 3, value: 'maxHumidity' },
  { id: 4, value: 'minTemperature' },
  { id: 5, value: 'created_at' },
  { id: 6, value: 'updated_at' },
  { id: 7, value: 'sensor ' },
];

const Home = () => {
  // Define states for filter criteria, pagination, sorting, and selection

  // Unique states for sensor data
  const [sensorFilter, setSensorFilter] = useState('');
  const [sensorSort, setSensorSort] = useState('created_at');
  const [sensorSortOrder, setSensorSortOrder] = useState<'ASC' | 'DESC'>(
    'DESC'
  );
  const [sensorFields, setSensorFields] = useState(''); // Default fields
  const [sensorPagination, setSensorPagination] = useState<PaginationModel>({
    page: 0,
    pageSize: 10,
  });

  // Unique states for soil data
  const [soilFilter, setSoilFilter] = useState('');
  const [soilSort, setSoilSort] = useState('created_at');
  const [soilSortOrder, setSoilSortOrder] = useState<'ASC' | 'DESC'>('DESC');
  const [soilFields, setSoilFields] = useState(''); // Default fields
  const [soilPagination, setSoilPagination] = useState<PaginationModel>({
    page: 0,
    pageSize: 10,
  });

  const [viewType, setViewType] = useState('grid'); // State to manage the view type

  const [filteredSoilData, setFilteredSoilData] = useState<ISoil[] | null>(
    null
  );
  const { data: OneSensorData } = useGetOneSensorQuery('');

  const [filteredSensorData, setFilteredSensorData] = useState<
    ISensor[] | null
  >(null);
  const [weatherEnabled, setWeatherEnabled] = useState(false);
  const floatingCardRef = useRef<HTMLDivElement | null>(null);

  // Use the mutation hook to fetch filtered data
  const [getSensors, { isLoading, error }] = useGetSensorsMutation();

  const fetchSensors = useCallback(
    async (queryString: string) => {
      try {
        const result = (await getSensors(queryString).unwrap()) as ISensor[];
        if (result) {
          setFilteredSensorData(result);
        }
      } catch (error) {
        console.error('Error fetching filtered data:', error);
      }
    },
    [getSensors]
  );

  useEffect(() => {
    const { page, pageSize } = sensorPagination;
    const pageNumber = page + 1;
    let queryString = `limit=${pageSize}&page=${pageNumber}&sortOrder=${sensorSortOrder}&sort=${sensorSort}&fields=${sensorFields}`;

    if (sensorFilter) {
      queryString += `&season=${sensorFilter}`;
    }

    fetchSensors(queryString);
  }, [
    sensorFilter,
    fetchSensors,
    sensorPagination,
    sensorSortOrder,
    sensorSort,
    sensorFields,
  ]);

  const [getSoils, { isLoading: soilsLoading, error: soilsError }] =
    useGetSoilsMutation();

  const fetchSoils = useCallback(
    async (queryString: string) => {
      try {
        const result = (await getSoils(queryString).unwrap()) as ISoil[];
        if (result) {
          setFilteredSoilData(result);
        }
      } catch (error) {
        console.error('Error fetching filtered data:', error);
      }
    },
    [getSoils]
  );

  useEffect(() => {
    const { page, pageSize } = soilPagination;
    const pageNumber = page + 1;
    let soilQueryString = `limit=${pageSize}&page=${pageNumber}&sortOrder=${soilSortOrder}&sort=${soilSort}&fields=${soilFields}`;

    if (soilFilter) {
      soilQueryString += `&soilType=${soilFilter}`;
    }

    fetchSoils(soilQueryString);
  }, [
    soilFilter,
    fetchSoils,
    soilPagination,
    soilSortOrder,
    soilSort,
    soilFields,
  ]);

  const handleSoilFilter = () => {
    const { page, pageSize } = soilPagination;
    const pageNumber = page + 1;
    let soilQueryString = `limit=${pageSize}&page=${pageNumber}&sortOrder=${soilSortOrder}&sort=${soilSort}&fields=${soilFields}`;
    if (soilFilter) {
      soilQueryString += `&soilType=${soilFilter}`;
    }

    fetchSoils(soilQueryString);
  };

  const handleFilter = async () => {
    const { page, pageSize } = sensorPagination;

    // Convert 0-based index to 1-based for server-side pagination
    const pageNumber = page + 1;

    let queryString = `limit=${pageSize}&page=${pageNumber}&sortOrder=${sensorSortOrder}&sort=${sensorSort}&fields=${sensorFields}`;

    if (sensorFilter) {
      queryString += `&season=${sensorFilter}`;
    }

    try {
      const result = (await getSensors(queryString).unwrap()) as ISensor[];
      if (result) {
        setFilteredSensorData(result); // Store filtered data in state
      }
    } catch (error) {
      console.error('Error fetching filtered data:', error);
    }
  };

  const handleViewChange = () => {
    setViewType((prevType) => (prevType === 'grid' ? 'kanban' : 'grid'));
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      floatingCardRef.current &&
      !floatingCardRef.current.contains(event.target as Node)
    ) {
      setWeatherEnabled(false);
    }
  };

  useEffect(() => {
    if (weatherEnabled) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [weatherEnabled]);

  const [calculateWaterDeficiency] = useCalculateWaterDeficiencyMutation();
  const [calculatePotentialEvapotranspiration] =
    useCalculatePotentialEvapotranspirationMutation();
  const [getIdealTemperature] = useGetIdealTemperatureMutation();
  const [getIdealHumidity] = useGetIdealHumidityMutation();

  const [waterDeficiencyResult, setWaterDeficiencyResult] = useState<
    number | null
  >(null);
  const [
    potentialEvapotranspirationResult,
    setPotentialEvapotranspirationResult,
  ] = useState<number | null>(null);
  const [idealTemperatureResult, setIdealTemperatureResult] = useState<
    number | null
  >(null);

  const [idealHumidityResult, setIdealHumidityResult] = useState<number | null>(
    null
  );

  const soilDataToDisplay = filteredSoilData;

  const soilDataTable: ISoil[] = useMemo(() => {
    return (
      soilDataToDisplay?.map((soil) => ({
        id: soil.id,
        minTemperature: soil.minTemperature,
        maxTemperature: soil.maxTemperature,
        minHumidity: soil.minHumidity,
        maxHumidity: soil.maxHumidity,
        soilType: soil.soilType,
        created_at: soil.created_at,
        updated_at: soil.updated_at,
        sensor: soil.sensor,
      })) ?? []
    );
  }, [soilDataToDisplay]);

  useEffect(() => {
    const handleWaterDeficiency = async () => {
      try {
        const result = await calculateWaterDeficiency({
          currentHumidity: 30,
          fieldCapacity: 50,
        }).unwrap();
        setWaterDeficiencyResult(result.deficiency);
      } catch (err) {
        console.error('Failed to calculate water deficiency:', err);
      }
    };

    const handlePotentialEvapotranspiration = async () => {
      try {
        const result = await calculatePotentialEvapotranspiration({
          kc: 1.2,
          eto: 5,
        }).unwrap();
        setPotentialEvapotranspirationResult(result.etp);
      } catch (err) {
        console.error('Failed to calculate potential evapotranspiration:', err);
      }
    };

    const handleIdealTemperature = async () => {
      try {
        const result = await getIdealTemperature({
          soilType: soilDataTable[0]?.soilType || 'Latossolos',
        }).unwrap();
        setIdealTemperatureResult(result.idealTemperature);
      } catch (err) {
        console.error('Failed to get ideal temperature:', err);
      }
    };

    const handleIdealHumidity = async () => {
      try {
        const result = await getIdealHumidity({
          soilType: soilDataTable[0]?.soilType || 'Latossolos',
        }).unwrap();
        setIdealHumidityResult(result.idealHumidity);
      } catch (err) {
        console.error('Failed to get ideal humidity:', err);
      }
    };

    handleWaterDeficiency();
    handlePotentialEvapotranspiration();
    handleIdealTemperature();
    handleIdealHumidity();
  }, [
    calculateWaterDeficiency,
    calculatePotentialEvapotranspiration,
    getIdealTemperature,
    getIdealHumidity,
    soilDataTable,
  ]);

  // Render loading state
  if (isLoading || soilsLoading) {
    return <FullScreenLoader />;
  }

  // Handle errors from both the initial query and the mutation
  if (error || soilsError) {
    return <Typography color='error'>An unexpected error occurred</Typography>;
  }

  // Determine which data set to use for the DataGrid
  const sensorDataToDisplay = filteredSensorData;

  // Convert data to IDataTable format for DataTable component
  const sensorDataTable =
    sensorDataToDisplay?.map((sensor) => ({
      id: sensor.id,
      temperature: sensor.temperature,
      season: sensor.season,
      humidity: sensor.humidity,
      created_at: moment(sensor.created_at).format('DD/MM/YYYY'),
      updated_at: moment(sensor.updated_at).format('DD/MM/YYYY'),
      soil: sensor.soil,
    })) ?? [];

  return (
    <>
      <Box
        style={{
          height: 'auto',
          width: '100%',
          marginBottom: '50px',
        }}
      >
        <Container maxWidth={'lg'}>
          <PageTitle title={'Sensores'} />
          {weatherEnabled && (
            <FloatingCard ref={floatingCardRef}>
              <Weather />
            </FloatingCard>
          )}
          <Box
            textAlign='right'
            display='flex'
            justifyContent='space-between'
            alignItems='center'
          >
            <Box display='flex' alignItems='center'>
              <Switch
                checked={weatherEnabled}
                onChange={() => setWeatherEnabled(!weatherEnabled)}
                name='weatherSwitch'
                color='primary'
              />
              <Typography>Ativar clima</Typography>
            </Box>

            <Button
              // fullWidth
              sx={{ mb: 2, mt: 2 }}
              variant='contained'
              color='primary'
              size='small'
              onClick={handleViewChange} // Function to toggle between views
            >
              {viewType === 'grid' ? 'Vizualizar Tabela' : 'Vizualizar Gráfico'}
            </Button>
          </Box>

          <Filter
            filterItem={filterItems}
            filter={sensorFilter}
            setFilter={setSensorFilter}
            sort={sensorSort}
            sortItem={sortItem}
            setSort={setSensorSort}
            sortOrder={sensorSortOrder}
            setSortOrder={setSensorSortOrder}
            fields={sensorFields}
            setFields={setSensorFields}
            paginationModel={sensorPagination}
            setPaginationModel={setSensorPagination}
            handleFilter={handleFilter}
          />
          {viewType === 'grid' ? (
            <>
              {sensorDataToDisplay?.length === 0 ? (
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
                    {/* HumidityLineChart */}
                    <Grid item sm={6} xs={12} md={6}>
                      <Item>
                        <HumidityLineChart
                          sensors={sensorDataToDisplay ?? []}
                          isError={error}
                          isLoading={isLoading}
                        />
                      </Item>
                    </Grid>
                    <Grid item sm={6} xs={12} md={6}>
                      {/* TemperatureLineChart */}
                      <Item>
                        <TemperatureLineChart
                          sensors={sensorDataToDisplay ?? []}
                          isError={error}
                          isLoading={isLoading}
                        />
                      </Item>
                    </Grid>
                    {/* idealHumidityResult */}
                    {idealHumidityResult !== null && (
                      <>
                        <Grid item sm={6} xs={12} md={3}>
                          <Item>
                            <GaugeChartComponent
                              id='humidity-gauge'
                              title={'Umidade Atual'}
                              item={
                                OneSensorData ? OneSensorData[0].humidity : 0
                              }
                              isError={error}
                              isLoading={isLoading}
                            />
                          </Item>
                        </Grid>
                        <Grid item sm={6} xs={12} md={3}>
                          <Item>
                            <GaugeChartComponent
                              id='humidity-gauge'
                              title={'Umidade Ideal'}
                              item={idealHumidityResult}
                              isError={error}
                              isLoading={isLoading}
                            />
                          </Item>
                        </Grid>
                      </>
                    )}
                    {/* idealTemperatureResult */}
                    {idealTemperatureResult !== null && (
                      <>
                        <Grid item sm={6} xs={12} md={3}>
                          <Item>
                            <GaugeChartComponent
                              id='temperature-gauge'
                              title={'Temperatura Atual'}
                              item={
                                OneSensorData ? OneSensorData[0].temperature : 0
                              }
                              isError={error}
                              isLoading={isLoading}
                            />
                          </Item>
                        </Grid>
                        <Grid item sm={6} xs={12} md={3}>
                          <Item>
                            <GaugeChartComponent
                              id='temperature-gauge'
                              title={'Temperatura Ideal'}
                              item={idealTemperatureResult}
                              isError={error}
                              isLoading={isLoading}
                            />
                          </Item>
                        </Grid>
                      </>
                    )}
                    {/* waterDeficiencyResult */}
                    {waterDeficiencyResult !== null && (
                      <Grid item xs={12} sm={12} md={6}>
                        <Item>
                          <WaterIcon color='primary' />
                          <Typography
                            variant='h6'
                            sx={{
                              transition: 'all 0.3s ease-in-out',
                              '&:hover': {
                                transform: 'scale(1.15)',
                                transformOrigin: 'center center',
                              },
                            }}
                          >
                            Deficiência de Água:
                          </Typography>
                          <Typography variant='h4' color={'Highlight'}>
                            {waterDeficiencyResult}
                          </Typography>
                        </Item>
                      </Grid>
                    )}
                    {/* potentialEvapotranspirationResult */}
                    {potentialEvapotranspirationResult !== null && (
                      <Grid item xs={12} sm={12} md={6}>
                        <Item>
                          <OpacityIcon color='secondary' />
                          <Typography
                            variant='h6'
                            sx={{
                              transition: 'all 0.3s ease-in-out',
                              '&:hover': {
                                transform: 'scale(1.15)',
                                transformOrigin: 'center center',
                              },
                            }}
                          >
                            Evapotranspiração Potencial:
                          </Typography>
                          <Typography variant='h4' color={'Highlight'}>
                            {potentialEvapotranspirationResult}
                          </Typography>
                        </Item>
                      </Grid>
                    )}
                  </Grid>
                </>
              )}
            </>
          ) : (
            <Box sx={{ overflowX: 'auto' }}>
              <DataTable columns={columns} data={sensorDataTable || []} />
              {/* Soil */}
              <PageTitle title={'Solo'} />
              <SensorFilter
                filterItem={soilFilterItems}
                filter={soilFilter}
                setFilter={setSoilFilter}
                sort={soilSort}
                sortItem={soilSortItem}
                setSort={setSoilSort}
                sortOrder={soilSortOrder}
                setSortOrder={setSoilSortOrder}
                fields={soilFields}
                setFields={setSoilFields}
                paginationModel={soilPagination}
                setPaginationModel={setSoilPagination}
                handleFilter={handleSoilFilter}
              />
              <SoilDataTable data={soilDataTable || []} />
            </Box>
          )}
        </Container>
      </Box>
    </>
  );
};

export default Home;
