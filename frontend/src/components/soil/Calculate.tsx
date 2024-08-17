import { Grid, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import {
  useCalculatePotentialEvapotranspirationMutation,
  useCalculateWaterDeficiencyMutation,
  useGetIdealTemperatureMutation,
} from '../../redux/api/soilApi';
import { GaugeChartComponent } from './GaugeChartComponent';

import OpacityIcon from '@mui/icons-material/Opacity';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import WaterIcon from '@mui/icons-material/Water';
import WaterDamageIcon from '@mui/icons-material/WaterDamage';

interface SoilTypeProps {
  soilType: string;
  temperature: number;
}

export const Calculate: React.FC<SoilTypeProps> = ({
  soilType,
  temperature,
}) => {
  const [calculateWaterDeficiency] = useCalculateWaterDeficiencyMutation();
  const [calculatePotentialEvapotranspiration] =
    useCalculatePotentialEvapotranspirationMutation();
  const [getIdealTemperature] = useGetIdealTemperatureMutation();

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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleWaterDeficiency = async () => {
      try {
        const result = await calculateWaterDeficiency({
          currentHumidity: 30,
          fieldCapacity: 50,
        }).unwrap();
        setWaterDeficiencyResult(result.deficiency);
        setError(null);
      } catch (err) {
        console.error('Failed to calculate water deficiency:', err);
        setError('Failed to calculate water deficiency');
      }
    };

    const handlePotentialEvapotranspiration = async () => {
      try {
        const result = await calculatePotentialEvapotranspiration({
          kc: 1.2,
          eto: 5,
        }).unwrap();
        setPotentialEvapotranspirationResult(result.etp);
        setError(null);
      } catch (err) {
        console.error('Failed to calculate potential evapotranspiration:', err);
        setError('Failed to calculate potential evapotranspiration');
      }
    };

    const handleIdealTemperature = async () => {
      try {
        const result = await getIdealTemperature({
          soilType: soilType,
        }).unwrap();
        setIdealTemperatureResult(result.idealTemperature);
        setError(null);
      } catch (err) {
        console.error('Failed to get ideal temperature:', err);
        setError('Failed to get ideal temperature');
      }
    };

    handleWaterDeficiency();
    handlePotentialEvapotranspiration();
    handleIdealTemperature();
  }, [
    calculateWaterDeficiency,
    calculatePotentialEvapotranspiration,
    getIdealTemperature,
    soilType,
  ]);

  // useEffect(() => {
  //   console.log('Updated Water Deficiency Result:', waterDeficiencyResult);
  // }, [waterDeficiencyResult]);

  // useEffect(() => {
  //   console.log(
  //     'Updated Potential Evapotranspiration Result:',
  //     potentialEvapotranspirationResult
  //   );
  // }, [potentialEvapotranspirationResult]);

  // useEffect(() => {
  //   console.log('Updated Ideal Temperature Result:', idealTemperatureResult);
  // }, [idealTemperatureResult]);

  return (
    <>
      <Grid
        container
        spacing={2}
        justifyContent={'center'}
        alignItems={'center'}
        display={'flex'}
        sx={{ p: { xs: 2, sm: 4, md: 6 } }}
      >
        <Grid item xs={12} sm={8} md={6}>
          <Typography
            color='info'
            variant='h4'
            sx={{
              textAlign: 'center',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                transform: 'scale(1.15)',
                transformOrigin: 'center center',
              },
            }}
          >
            Água{' '}
            <WaterDamageIcon
              color='info'
              sx={{
                width: { xs: 40, sm: 50, md: 60 },
                height: { xs: 40, sm: 50, md: 60 },
              }}
            />
          </Typography>
          <Grid container>
            {waterDeficiencyResult !== null && (
              <Grid item xs={12} sm={8} md={6}>
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
              </Grid>
            )}
            {potentialEvapotranspirationResult !== null && (
              <Grid item xs={12} sm={8} md={6}>
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
              </Grid>
            )}
          </Grid>
        </Grid>
        <Grid item xs={12} sm={8} md={6}>
          <Typography
            color={'red'}
            variant='h4'
            sx={{
              textAlign: 'center',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                transform: 'scale(1.15)',
                transformOrigin: 'center center',
              },
            }}
          >
            Temperatura{' '}
            <ThermostatIcon
              color='error'
              sx={{
                width: { xs: 40, sm: 50, md: 60 },
                height: { xs: 40, sm: 50, md: 60 },
              }}
            />
          </Typography>
          <Grid container>
            {idealTemperatureResult !== null && (
              <>
                <Grid item xs={12} sm={8} md={6}>
                  <GaugeChartComponent
                    id='temperature-gauge'
                    title={'Atual'}
                    item={temperature}
                  />
                </Grid>
                <Grid item xs={12} sm={8} md={6}>
                  <GaugeChartComponent
                    id='temperature-gauge'
                    title={'Ideal'}
                    item={idealTemperatureResult}
                  />
                </Grid>
              </>
            )}
          </Grid>
        </Grid>
      </Grid>
      {error && (
        <div>
          <h3>Error:</h3>
          <p>{error}</p>
        </div>
      )}
    </>
  );
};

export default Calculate;
