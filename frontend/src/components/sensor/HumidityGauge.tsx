import { Typography } from '@mui/material';
import GaugeChart from 'react-gauge-chart';
import { useGetAllSensorsQuery } from '../../redux/api/sensorApi';

export default function HumidityGauge() {
  const { isLoading, isError, data: sensors } = useGetAllSensorsQuery();

  // Extract last humidity value from sensorData array
  const lastHumidity =
    sensors && sensors.length > 0 ? sensors[sensors.length - 1].humidity : 0;

  return (
    <>
      <Typography>Humidity</Typography>
      {!isLoading && !isError && sensors && (
        <GaugeChart
          id='humidity-gauge'
          percent={lastHumidity / 100} // Normalize humidity value to a percentage
          arcPadding={0.02}
          arcWidth={0.3}
          colors={['#FF5F6D', '#FFC371', '#4BD2D2']}
          needleColor='#464A4E'
          needleBaseColor='#464A4E'
          textColor='#464A4E'
          hideText={false} // Show text
        />
      )}
    </>
  );
}
