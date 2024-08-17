import { Button, ButtonGroup, Typography } from '@mui/material';
import moment from 'moment-timezone';
import React, { useState } from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from 'recharts';
import { ISensor } from '../../redux/api/types';

import './sensor.style.css';

interface TemperatureLineChartProps {
  isLoading: boolean;
  isError: unknown;
  sensors: ISensor[];
}

interface CustomTooltipProps extends TooltipProps<number, string> {
  active?: boolean;
  payload?: {
    payload: {
      time: number;
      temperature: number;
      created_at: string;
    };
  }[];
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const sensor = payload[0].payload;
    const formattedDate = moment(sensor.created_at).format(
      'YYYY-MM-DD HH:mm:ss'
    );
    return (
      <div
        className='custom-tooltip'
        style={{
          backgroundColor: 'white',
          padding: '5px',
          border: '1px solid #ccc',
        }}
      >
        <p>{`Time: ${sensor.time}`}</p>
        <p>{`Temperature: ${sensor.temperature}%`}</p>
        <p>{`Created at: ${formattedDate}`}</p>
      </div>
    );
  }

  return null;
};

export const TemperatureLineChart: React.FC<TemperatureLineChartProps> = ({
  isLoading,
  isError,
  sensors,
}) => {
  const [selectedRange, setSelectedRange] = useState('today');

  const tz = 'America/Sao_Paulo';

  const getDateRange = (range: string) => {
    const today = moment.tz(tz);
    let start, end;

    switch (range) {
      case 'today':
        start = today.clone().startOf('day');
        end = today.clone().endOf('day');
        break;
      case 'one_week':
        start = today.clone().subtract(7, 'days').startOf('day');
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

  const filteredSensors = sensors?.filter((sensor) => {
    const sensorDate = moment(sensor.created_at).tz(tz);
    return sensorDate.isBetween(start, end, undefined, '[]');
  });

  const temperatures =
    filteredSensors?.map((sensor) => sensor.temperature) || [];

  // const xAxis = Array.from({ length: temperatures.length }, (_, i) => i + 1);

  return (
    <>
      <Typography variant='h6' color={'red'}>
        Temperatura
      </Typography>

      <ButtonGroup sx={{ paddingBottom: 2, paddingTop: 2 }}>
        <Button
          onClick={() => setSelectedRange('today')}
          variant={selectedRange === 'today' ? 'contained' : 'outlined'}
        >
          Hoje
        </Button>
        <Button
          onClick={() => setSelectedRange('one_week')}
          variant={selectedRange === 'one_week' ? 'contained' : 'outlined'}
        >
          1 Semana
        </Button>
        <Button
          onClick={() => setSelectedRange('one_month')}
          variant={selectedRange === 'one_month' ? 'contained' : 'outlined'}
        >
          1 Mês
        </Button>
        <Button
          onClick={() => setSelectedRange('one_year')}
          variant={selectedRange === 'one_year' ? 'contained' : 'outlined'}
        >
          1 Ano
        </Button>
      </ButtonGroup>

      {!isLoading && !isError && filteredSensors && (
        <LineChart
          width={500}
          height={300}
          data={temperatures.map((temp, index) => ({
            time: index + 1,
            temperature: temp,
          }))}
        >
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='time' />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            dot={false} // Remove dots from the line chart
            type='monotone'
            dataKey='temperature'
            stroke='red'
            fillOpacity={1}
            fill='url(#colorUv)'
          />
        </LineChart>
      )}
    </>
  );
};

export default TemperatureLineChart;
