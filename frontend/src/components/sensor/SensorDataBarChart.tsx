import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface Sensor {
  id: string;
  temperature: string;
  humidity: number;
  season: string;
  created_at: string;
  updated_at: string;
}

interface Props {
  sensorData: Sensor[];
}

export const SensorDataBarChart: React.FC<Props> = ({ sensorData }) => {
  const convertDataForBarChart = (sensorData: Sensor[]) => {
    const seasons = ['Spring', 'Summer', 'Fall', 'Winter'];
    const dataBySeason: { [key: string]: number[] } = {};

    // Initialize dataBySeason with empty arrays for each season
    seasons.forEach((season) => {
      dataBySeason[season] = [];
    });

    // Populate dataBySeason with temperature data for each season
    sensorData.forEach((sensor) => {
      if (seasons.includes(sensor.season)) {
        dataBySeason[sensor.season].push(parseFloat(sensor.temperature));
      }
    });

    // Calculate average temperature for each season
    const chartData = seasons.map((season) => ({
      season,
      temperature:
        dataBySeason[season].reduce((sum, temp) => sum + temp, 0) /
          dataBySeason[season].length || 0,
    }));

    return chartData;
  };

  const chartData = convertDataForBarChart(sensorData);

  return (
    <ResponsiveContainer width='100%' height={300}>
      <BarChart
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray='3 3' />
        <XAxis dataKey='season' />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey='temperature' fill='#8884d8' />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default SensorDataBarChart;
