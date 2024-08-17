import { Typography } from '@mui/material';
import GaugeChart from 'react-gauge-chart';
// import { ISensor } from '../../redux/api/types';

interface HumidityGaugeProps {
  isLoading: boolean;
  isError: unknown;
  // sensors: ISensor[]; // You might want to replace `any[]` with the appropriate type for your sensors
  humidity: number;
}

export const HumidityGauge: React.FC<HumidityGaugeProps> = ({
  isLoading,
  isError,
  humidity,
}) => {
  // Extract last humidity value from sensorData array
  // const lastHumidity =
  //   sensors && sensors.length > 0 ? sensors[sensors.length - 1].humidity : 0;

  return (
    <>
      <Typography color={'#8884d8'}>Umidade</Typography>
      {!isLoading && !isError && humidity && (
        <GaugeChart
          id='humidity-gauge'
          percent={humidity / 100} // Normalize humidity value to a percentage
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

export default HumidityGauge;
