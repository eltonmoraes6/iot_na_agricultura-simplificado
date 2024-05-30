import { Typography } from '@mui/material';
import GaugeChart from 'react-gauge-chart';
import { ISensor } from '../../redux/api/types';

interface HumidityGaugeProps {
  isLoading: boolean;
  isError: unknown;
  sensors: ISensor[]; // You might want to replace `any[]` with the appropriate type for your sensors
}

export const HumidityGauge: React.FC<HumidityGaugeProps> = ({
  isLoading,
  isError,
  sensors,
}) => {
  // Extract last humidity value from sensorData array
  const lastHumidity =
    sensors && sensors.length > 0 ? sensors[sensors.length - 1].humidity : 0;

  return (
    <>
      <Typography color={'#8884d8'}>Umidade</Typography>
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
};

export default HumidityGauge;
