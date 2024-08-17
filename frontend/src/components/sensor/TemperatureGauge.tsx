import { Typography } from '@mui/material';
import GaugeChart from 'react-gauge-chart';

interface TemperatureGaugeProps {
  isLoading: boolean;
  isError: unknown;
  // sensors: ISensor[]; // You might want to replace `any[]` with the appropriate type for your sensors
  temperature: number;
}

export const TemperatureGauge: React.FC<TemperatureGaugeProps> = ({
  isLoading,
  isError,
  temperature,
}) => {
  // Extract last temperature value from sensorData array
  // const lastTemperature =
  //   sensors && sensors.length > 0 ? sensors[sensors.length - 1].temperature : 0;

  return (
    <>
      <Typography color={'red'}>Temperatura</Typography>
      {!isLoading && !isError && temperature && (
        <GaugeChart
          id='temperature-gauge'
          percent={temperature / 100} // Normalize temperature value to a percentage
          arcPadding={0.02}
          arcWidth={0.3}
          colors={['#4BD2D2', '#FFC371', '#FF5F6D']}
          needleColor='#464A4E'
          needleBaseColor='#464A4E'
          textColor='#464A4E'
          hideText={false} // Show text
        />
      )}
    </>
  );
};

export default TemperatureGauge;
