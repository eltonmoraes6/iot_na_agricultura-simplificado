import { Button, ButtonGroup, Typography } from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';
import moment from 'moment-timezone';
import { useState } from 'react';
import { ISensor } from '../../redux/api/types';

interface TemperatureGaugeProps {
  isLoading: boolean;
  isError: unknown;
  sensors: ISensor[]; // You might want to replace `any[]` with the appropriate type for your sensors
}

export const TemperatureLineChart: React.FC<TemperatureGaugeProps> = ({
  isLoading,
  isError,
  sensors,
}) => {
  const [selectedRange, setSelectedRange] = useState('today');

  const tz = 'America/Sao_Paulo'; // Set your desired time zone
  // Function to get the date range based on the selected option
  const getDateRange = (range: unknown) => {
    const today = moment.tz(tz); // Use tz() to set the time zone
    let start, end;

    switch (range) {
      case 'today':
        start = today.clone().startOf('day'); // Start of today
        end = today.clone().endOf('day'); // End of today
        break;

      case 'one_week':
        start = today.clone().subtract(7, 'days').startOf('day'); // One week ago
        end = today.clone().endOf('day'); // End of today
        break;

      case 'one_month':
        start = today.clone().subtract(1, 'month').startOf('day'); // One month ago
        end = today.clone().endOf('day'); // End of today
        break;

      case 'one_year':
        start = today.clone().subtract(1, 'year').startOf('day'); // One year ago
        end = today.clone().endOf('day'); // End of today
        break;

      default:
        start = today.clone().subtract(1, 'year').startOf('day'); // Default to one year
        end = today.clone().endOf('day');
        break;
    }

    return { start, end };
  };

  const { start, end } = getDateRange(selectedRange);

  // Filter sensors within the selected date range
  const filteredSensors = sensors?.filter((sensor) => {
    const sensorDate = moment(sensor.created_at).tz(tz); // Use correct time zone
    return sensorDate.isBetween(start, end, undefined, '[]'); // Inclusive boundaries
  });

  const temperatures =
    filteredSensors?.map((sensor) => sensor.temperature) || [];

  // Create an array of indices for x-axis
  const xAxis = Array.from({ length: temperatures.length }, (_, i) => i + 1);

  return (
    <>
      <Typography variant='h6'>Temperatura - Gráfico de Linha</Typography>

      {/* Date Range Selection */}
      <ButtonGroup>
        <Button onClick={() => setSelectedRange('today')}>Today</Button>
        <Button onClick={() => setSelectedRange('one_week')}>1 Week</Button>
        <Button onClick={() => setSelectedRange('one_month')}>1 Month</Button>
        <Button onClick={() => setSelectedRange('one_year')}>1 Year</Button>
      </ButtonGroup>

      {/* Line Chart with filtered data */}
      {!isLoading && !isError && filteredSensors && (
        <LineChart
          xAxis={[{ data: xAxis }]}
          series={[
            {
              data: temperatures,
              area: true,
              color: 'red', // Color for temperature
            },
          ]}
          width={500}
          height={300}
        />
      )}
    </>
  );
};

export default TemperatureLineChart;
