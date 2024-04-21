import { Typography } from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';
import { useGetAllSensorsQuery } from '../../redux/api/sensorApi';

export default function TemperatureLineChart() {
  const { isLoading, isError, data: sensors } = useGetAllSensorsQuery();

  // Extract temperature values from sensorData array
  const temperatures = sensors.map((data) => parseFloat(data.temperature));

  // Create an array of indices for x-axis
  const xAxis = Array.from({ length: temperatures.length }, (_, i) => i + 1);

  return (
    <>
      <Typography>Temperature</Typography>
      {!isLoading && !isError && sensors && (
        <LineChart
          xAxis={[{ data: xAxis }]}
          series={[
            {
              data: temperatures,
              area: true,
              color: 'red', // Set color here
            },
          ]}
          width={500}
          height={300}
        />
      )}
    </>
  );
}
