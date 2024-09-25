import {
  Box,
  Button,
  Container,
  Grid,
  MenuItem,
  Paper,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { createColumnHelper } from '@tanstack/react-table';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { GaugeChartComponent } from '../components/GaugeChartComponent';
import PageTitle from '../components/PageTitle';
import ReusableSensorComponent from '../components/ReusableSensorComponent ';
import Weather from '../components/weather/Weather';
import {
  useGetHumiditiesMutation,
  useGetLatestHumidityQuery,
} from '../redux/api/humidityApi';
import {
  useCalculatePotentialEvapotranspirationMutation,
  useCalculateWaterDeficiencyMutation,
  useGetMetricsMutation,
} from '../redux/api/metricApi';
import {
  useGetLatestTemperatureQuery,
  useGetTemperaturesMutation,
} from '../redux/api/temperatureApi';
import { IMetric } from '../redux/types/metricTypes';

import OpacityIcon from '@mui/icons-material/Opacity';
import WaterIcon from '@mui/icons-material/Water';
import MetricLineChart from '../components/MetricLineChart';
import WaterFlowIndicator from '../components/waterFlow/WaterFlowIndicator';
import { PaginationModel } from '../redux/api/types';
import { IHumidity } from '../redux/types/humidityTypes';
import { ITemperature } from '../redux/types/temperatureTypes';

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

const columnHelper = createColumnHelper<IMetric>();

const soilColumns = [
  columnHelper.accessor('id', {
    header: 'ID',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('minTemperature', {
    header: 'Temperatura Mínima',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('maxTemperature', {
    header: 'Temperatura Máxima',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('minHumidity', {
    header: 'Umidade Mínima',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('maxHumidity', {
    header: 'Umidade Máxima',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('soilType', {
    header: 'Tipo de Solo',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('season', {
    header: 'Estação do Ano',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('created_at', {
    header: 'Criação',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('updated_at', {
    header: 'Edição',
    cell: (info) => info.getValue(),
  }),
];

const metricsFilterItems: { id: number; value: string }[] = [];

const sortItems = [
  { id: 0, value: 'id' },
  { id: 5, value: 'created_at' },
  { id: 6, value: 'updated_at' },
];

const HomePage = () => {
  const [weatherEnabled, setWeatherEnabled] = useState(false);
  const floatingCardRef = useRef<HTMLDivElement | null>(null);

  const [pagination, setPagination] = useState<PaginationModel>({
    page: 0,
    pageSize: 10,
  });
  const [sort, setSort] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');

  const { data: humi } = useGetLatestHumidityQuery('');

  const { data: temp } = useGetLatestTemperatureQuery('');

  const [getMetrics, { data: metricsData, isError, isLoading }] =
    useGetMetricsMutation();

  const [
    getTemperatures,
    { isError: temperatureIsError, isLoading: temperatureIsLoading },
  ] = useGetTemperaturesMutation();
  const [
    getHumidities,
    { isError: humidityIsError, isLoading: humidityIsLoading },
  ] = useGetHumiditiesMutation();

  const [calculateWaterDeficiency] = useCalculateWaterDeficiencyMutation();
  const [calculatePotentialEvapotranspiration] =
    useCalculatePotentialEvapotranspirationMutation();

  const [waterDeficiencyResult, setWaterDeficiencyResult] = useState<
    number | null
  >(null);
  const [
    potentialEvapotranspirationResult,
    setPotentialEvapotranspirationResult,
  ] = useState<number | null>(null);

  // Access the latest metric object
  const latestMetric =
    metricsData && metricsData.length > 0
      ? metricsData[metricsData.length - 1]
      : null;

  useEffect(() => {
    getHumidities('');
  }, [getHumidities]);

  useEffect(() => {
    getTemperatures('');
  }, [getTemperatures]);

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
    handleWaterDeficiency();
    handlePotentialEvapotranspiration();
  }, [calculateWaterDeficiency, calculatePotentialEvapotranspiration]);

  const [humidityFilteredData, setHumidityFilteredData] = useState<
    IHumidity[] | null
  >(null);
  const [temperatureFilteredData, setTemperatureFilteredData] = useState<
    ITemperature[] | null
  >(null);

  const fetchHumidityData = useCallback(
    async (queryString: string) => {
      try {
        const result = await getHumidities(queryString); // result contains { data } or { error }
        if ('data' in result && result.data) {
          setHumidityFilteredData(result.data); // Set the actual humidities array
        }
      } catch (error) {
        console.error(`Error fetching data:`, error);
      }
    },
    [getHumidities]
  );

  const fetchTemperatureData = useCallback(
    async (queryString: string) => {
      try {
        const result = await getTemperatures(queryString); // result contains { data } or { error }
        if ('data' in result && result.data) {
          setTemperatureFilteredData(result.data); // Set the actual humidities array
        }
      } catch (error) {
        console.error(`Error fetching data:`, error);
      }
    },
    [getTemperatures]
  );

  useEffect(() => {
    const { page, pageSize } = pagination;
    const pageNumber = page + 1;
    const queryString = `limit=${pageSize}&page=${pageNumber}&sortOrder=${sortOrder}&sort=${sort}`;

    fetchHumidityData(queryString);
    fetchTemperatureData(queryString);
  }, [pagination, sortOrder, sort, fetchHumidityData, fetchTemperatureData]);

  const handleFilter = () => {
    const { page, pageSize } = pagination;
    const pageNumber = page + 1;
    const queryString = `limit=${pageSize}&page=${pageNumber}&sortOrder=${sortOrder}&sort=${sort}`;
    fetchHumidityData(queryString);
    fetchTemperatureData(queryString);
  };

  const humidityDataToDisplay = humidityFilteredData;
  const temperatureDataToDisplay = temperatureFilteredData;

  const humidityDataTable: IHumidity[] = useMemo(() => {
    return (
      humidityDataToDisplay?.map((item) => ({
        ...item,
      })) ?? []
    );
  }, [humidityDataToDisplay]);

  const temperatureDataTable: ITemperature[] = useMemo(() => {
    return (
      temperatureDataToDisplay?.map((item) => ({
        ...item,
      })) ?? []
    );
  }, [temperatureDataToDisplay]);

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

          {/* Filter Items */}

          <Grid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            sx={{ mb: 4 }}
          >
            <Grid item sm={6} md={2} xs={12}>
              <TextField
                label='Página'
                variant='outlined'
                margin='normal'
                type='number'
                value={pagination.page + 1} // Display 1-based index to user
                onChange={(e) =>
                  setPagination((prev) => ({
                    ...prev,
                    page: parseInt(e.target.value, 10) - 1,
                  }))
                }
                size='small'
                fullWidth
              />
            </Grid>
            <Grid item sm={6} md={2} xs={12}>
              <TextField
                label='Limite'
                variant='outlined'
                margin='normal'
                type='number'
                value={pagination.pageSize}
                onChange={(e) =>
                  setPagination((prev) => ({
                    ...prev,
                    pageSize: parseInt(e.target.value, 10),
                  }))
                }
                size='small'
                fullWidth
              />
            </Grid>
            <Grid item sm={6} md={3} xs={12}>
              <TextField
                label='Ordenar por'
                variant='outlined'
                margin='normal'
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                size='small'
                fullWidth
                select
              >
                {sortItems.map((option) => (
                  <MenuItem key={option.id} value={option.value}>
                    {option.value}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item sm={6} md={3} xs={12}>
              <TextField
                label='Ordem'
                variant='outlined'
                margin='normal'
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as 'ASC' | 'DESC')}
                size='small'
                fullWidth
                select
              >
                {['ASC', 'DESC'].map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item sm={6} md={2} xs={12}>
              <Button
                variant='contained'
                color='primary'
                sx={{ mt: 2 }}
                size='medium'
                fullWidth
                onClick={handleFilter}
              >
                Aplicar Filtro
              </Button>
            </Grid>
          </Grid>

          <Box
            textAlign='right'
            display='flex'
            // justifyContent='space-between'
            alignItems='center'
          >
            <Switch
              checked={weatherEnabled}
              onChange={() => setWeatherEnabled(!weatherEnabled)}
              name='weatherSwitch'
              color='primary'
            />
            <Typography>Ativar clima</Typography>
          </Box>

          <Grid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          >
            {/* HumidityLineChart */}
            <Grid item sm={6} xs={12} md={6}>
              <Item>
                <MetricLineChart
                  isLoading={humidityIsLoading}
                  isError={humidityIsError}
                  data={humidityDataTable ?? []}
                  dataKey='id'
                  valueField='humidity'
                  unit='%'
                  chartTitle='Umidade'
                  color='red'
                />
              </Item>
            </Grid>
            <Grid item sm={6} xs={12} md={6}>
              {/* TemperatureLineChart */}
              <Item>
                <MetricLineChart
                  isLoading={temperatureIsLoading}
                  isError={temperatureIsError}
                  data={temperatureDataTable ?? []}
                  dataKey='id'
                  valueField='temperature'
                  unit='°C'
                  chartTitle='Temperatura'
                  color='red'
                />
              </Item>
            </Grid>

            <Grid item sm={6} xs={12} md={6}>
              <Item>
                <GaugeChartComponent
                  id='humidity-gauge'
                  title={'Umidade Atual'}
                  item={humi ? humi[0].humidity : 0}
                  isError={isError}
                  isLoading={isLoading}
                />
              </Item>
            </Grid>

            <Grid item sm={6} xs={12} md={6}>
              <Item>
                <GaugeChartComponent
                  id='temperature-gauge'
                  title={'Temperatura Atual'}
                  item={temp ? temp[0].temperature : 0}
                  isError={isError}
                  isLoading={isLoading}
                />
              </Item>
            </Grid>
            {/* Season */}
            <Grid item sm={6} xs={12} md={6}>
              <Item>
                <Typography variant='h3' color={'black'}>
                  Estação do Ano
                </Typography>
                <Typography color={'black'}>{latestMetric?.season}</Typography>
              </Item>
            </Grid>
            {/* Soil Type */}
            <Grid item sm={6} xs={12} md={6}>
              <Item>
                <Typography variant='h3' color={'black'}>
                  Tipo de Solo
                </Typography>
                <Typography color={'black'}>
                  {latestMetric?.soilType}
                </Typography>
              </Item>
            </Grid>

            {/* idealHumidityResult */}
            <>
              <Grid item sm={6} xs={12} md={3}>
                <Item>
                  <GaugeChartComponent
                    id='humidity-gauge'
                    title={'Umidade mínima'}
                    item={latestMetric?.minHumidity ?? 0}
                    isError={isError}
                    isLoading={isLoading}
                  />
                </Item>
              </Grid>
              <Grid item sm={6} xs={12} md={3}>
                <Item>
                  <GaugeChartComponent
                    id='humidity-gauge'
                    title={'Umidade máxima'}
                    item={latestMetric?.maxHumidity ?? 0}
                    isError={humidityIsError}
                    isLoading={humidityIsLoading}
                  />
                </Item>
              </Grid>
            </>

            {/* idealTemperatureResult */}
            <>
              <Grid item sm={6} xs={12} md={3}>
                <Item>
                  <GaugeChartComponent
                    id='temperature-gauge'
                    title={'Temperatura Máxima'}
                    item={latestMetric?.minTemperature ?? 0}
                    isError={isError}
                    isLoading={isLoading}
                  />
                </Item>
              </Grid>
              <Grid item sm={6} xs={12} md={3}>
                <Item>
                  <GaugeChartComponent
                    id='temperature-gauge'
                    title={'Temperatura Mínima'}
                    item={latestMetric?.maxTemperature ?? 0}
                    isError={isError}
                    isLoading={isLoading}
                  />
                </Item>
              </Grid>
            </>

            {/* waterDeficiencyResult */}

            <Grid item xs={12} sm={12} md={4}>
              <Item>
                <WaterIcon
                  color='primary'
                  sx={{
                    fontSize: 48,
                    animation: 'pulse 2s infinite',
                  }}
                />
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
                <Typography variant='h2' color={'Highlight'}>
                  {waterDeficiencyResult}
                </Typography>
              </Item>
            </Grid>

            {/* potentialEvapotranspirationResult */}

            <Grid item xs={12} sm={12} md={4}>
              <Item>
                <OpacityIcon
                  color='secondary'
                  sx={{
                    fontSize: 48,
                    animation: 'pulse 2s infinite',
                  }}
                />
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
                <Typography variant='h2' color={'Highlight'}>
                  {potentialEvapotranspirationResult}
                </Typography>
              </Item>
            </Grid>

            {/* WaterFlowIndicator */}
            <Grid item xs={12} sm={12} md={4}>
              <Item>
                <WaterFlowIndicator
                  isIrrigated={true}
                  waterFlowRate={10}
                  totalWaterUsed={150}
                />
              </Item>
            </Grid>
          </Grid>
          <ReusableSensorComponent<IMetric>
            title='Métricas'
            getMutation={getMetrics}
            filterType='soilType'
            filterItems={metricsFilterItems}
            sortItems={sortItems}
            columns={soilColumns}
          />
        </Container>
      </Box>
    </>
  );
};

export default HomePage;
