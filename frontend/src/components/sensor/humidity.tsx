import { Typography } from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';
import { useGetAllSensorsQuery } from '../../redux/api/sensorApi';

export default function HumidityLineChart() {
  const { isLoading, isError, data: sensors } = useGetAllSensorsQuery();

  // Extract humidity values from sensorData array
  const humidity = sensors.map((data) => parseFloat(data.humidity));

  // Create an array of indices for x-axis
  const xAxis = Array.from({ length: humidity.length }, (_, i) => i + 1);

  return (
    <>
      <Typography>Humidity</Typography>
      {!isLoading && !isError && sensors && (
        <LineChart
          xAxis={[{ data: xAxis }]}
          series={[
            {
              data: humidity,
              area: true,
              color: 'blue', // Set color here
            },
          ]}
          width={500}
          height={300}
        />
      )}
    </>
  );
}
