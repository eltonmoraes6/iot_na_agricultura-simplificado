import { Box, Button, ButtonGroup, Typography } from '@mui/material';
import moment from 'moment-timezone';
import { useState } from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface MetricLineChartProps<T> {
  isLoading: boolean;
  isError: unknown;
  data: T[];
  dataKey: keyof T; // The key to display on X-axis or time key
  valueField: keyof T; // The key to plot on Y-axis (e.g., temperature, humidity)
  unit?: string; // Optional unit to display
  chartTitle: string; // Title for the chart
  color: string; // Color of the chart
  height?: number;
  width?: number;
}

interface TooltipProps<T> {
  active?: boolean;
  payload?: { payload: T }[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = <T extends Record<string, any>>({
  active,
  payload,
}: TooltipProps<T>) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    const formattedDate = moment(item.created_at).format('YYYY-MM-DD HH:mm:ss');
    return (
      <div
        className='custom-tooltip'
        style={{
          backgroundColor: 'white',
          padding: '5px',
          border: '1px solid #ccc',
        }}
      >
        <p>{`Value: ${item.value}`}</p>
        <p>{`Created at: ${formattedDate}`}</p>
      </div>
    );
  }
  return null;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const MetricLineChart = <T extends Record<string, any>>({
  isLoading,
  isError,
  data,
  chartTitle,
  color,
  unit,
  valueField,
  width,
  height,
}: MetricLineChartProps<T>) => {
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

  const filteredData = data?.filter((item) => {
    const date = moment(item.created_at).tz(tz);
    return date.isBetween(start, end, undefined, '[]');
  });

  const chartData =
    filteredData?.map((item, index) => ({
      time: index + 1,
      value: item[valueField], // Dynamically choose the field for the Y-axis
      created_at: item.created_at,
    })) || [];

  return (
    <>
      <Typography variant='h6' color={color}>
        {chartTitle} {unit && `(${unit})`}
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

      {!isLoading && !isError && filteredData && (
        <Box
          sx={{
            justifyContent: 'center',
            alignItems: 'center',
            display: 'flex',
          }}
        >
          <LineChart
            width={width ? width : 500}
            height={height ? height : 300}
            data={chartData}
            style={{}}
          >
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='time' />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              dot={false}
              type='monotone'
              dataKey='value' // Dynamic key
              stroke={color}
            />
          </LineChart>
        </Box>
      )}
    </>
  );
};

export default MetricLineChart;
