import { Button, ButtonGroup, Typography } from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';
import moment from 'moment-timezone'; // Correct import for time zone handling
import { useState } from 'react';
import { ISensor } from '../../redux/api/types';

interface HumidityGaugeProps {
  isLoading: boolean;
  isError: unknown;
  sensors: ISensor[]; // You might want to replace `any[]` with the appropriate type for your sensors
}

export const HumidityLineChart: React.FC<HumidityGaugeProps> = ({
  isLoading,
  isError,
  sensors,
}) => {
  const [selectedRange, setSelectedRange] = useState('today');

  const tz = 'America/Sao_Paulo'; // Correct time zone
  // Function to get the date range based on the selected option
  const getDateRange = (range: unknown) => {
    const today = moment.tz(tz); // Use tz() to set time zone
    let start, end;

    switch (range) {
      case 'today':
        start = today.clone().startOf('day'); // Clone before manipulating
        end = today.clone().endOf('day');
        break;

      case 'one_week':
        start = today.clone().subtract(7, 'days').startOf('day'); // Correct cloning
        end = today.clone().endOf('day');
        break;

      case 'one_month':
        start = today.clone().subtract(1, 'month').startOf('day');
        end = today.clone().endOf('day');
        break;

      case 'one_year':
        start = today.clone().subtract(1, 'year').startOf('day');
        end = today.clone().endOf('day');
        break;

      default:
        start = today.clone().subtract(1, 'year').startOf('day');
        end = today.clone().endOf('day');
        break;
    }

    return { start, end };
  };

  const { start, end } = getDateRange(selectedRange);

  // Filter sensors within the selected date range
  const filteredSensors = sensors?.filter((sensor) => {
    const sensorDate = moment(sensor.created_at).tz(tz); // Ensure correct time zone
    return sensorDate.isBetween(start, end, undefined, '[]'); // Ensure correct filtering
  });

  const humidity = filteredSensors?.map((d) => d.humidity) || [];
  const xAxis = Array.from({ length: humidity.length }, (_, i) => i + 1);

  return (
    <>
      <Typography variant='h6'>Umidade - Gráfico de Linha</Typography>

      {/* Date Range Selection */}
      <ButtonGroup>
        <Button onClick={() => setSelectedRange('today')}>Today</Button>
        <Button onClick={() => setSelectedRange('one_week')}>1 Week</Button>
        <Button onClick={() => setSelectedRange('one_month')}>1 Month</Button>
        <Button onClick={() => setSelectedRange('one_year')}>1 Year</Button>
      </ButtonGroup>

      {/* Line Chart */}
      {!isLoading && !isError && filteredSensors && (
        <LineChart
          xAxis={[{ data: xAxis }]}
          series={[
            {
              data: humidity,
              area: true,
              color: 'blue',
            },
          ]}
          width={500}
          height={300}
        />
      )}
    </>
  );
};

export default HumidityLineChart;
