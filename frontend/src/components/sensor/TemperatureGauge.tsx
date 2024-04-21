import { Typography } from '@mui/material';
import GaugeChart from 'react-gauge-chart';
import { useGetAllSensorsQuery } from '../../redux/api/sensorApi';

export default function TemperatureGauge() {
  const { isLoading, isError, data: sensors } = useGetAllSensorsQuery();

  // Extract last temperature value from sensorData array
  const lastTemperature =
    sensors && sensors.length > 0
      ? parseFloat(sensors[sensors.length - 1].temperature)
      : 0;

  return (
    <>
      <Typography>Temperature</Typography>
      {!isLoading && !isError && sensors && (
        <GaugeChart
          id='temperature-gauge'
          percent={lastTemperature / 100} // Normalize temperature value to a percentage
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
