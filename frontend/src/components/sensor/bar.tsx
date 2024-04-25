import { BarChart } from '@mui/x-charts/BarChart';
import React from 'react';

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

const SensorDataBarChart: React.FC<Props> = ({ sensorData }) => {
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

    // Convert dataBySeason to format compatible with BarChart component
    const seriesData = seasons.map((season) => ({
      data: dataBySeason[season],
    }));

    const xAxisData = [{ data: seasons, scaleType: 'band' as const }]; // Explicit scale type

    return { series: seriesData, xAxis: xAxisData };
  };

  const chartData = convertDataForBarChart(sensorData);

  return (
    <BarChart
      series={chartData.series}
      height={290}
      xAxis={chartData.xAxis}
      margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
    />
  );
};

export default SensorDataBarChart;
