import { Typography } from '@mui/material';
import React from 'react';
import GaugeChart from 'react-gauge-chart';

interface GaugeProps {
  id: string;
  item: number;
  title: string;
}

export const GaugeChartComponent: React.FC<GaugeProps> = ({
  id,
  item,
  title,
}) => {
  return (
    <>
      <Typography
        variant='h6'
        color={'info'}
        sx={{
          textAlign: 'center',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'scale(1.25)',
            transformOrigin: 'center center', // Change transform origin to right side
          },
        }}
      >
        {title}
      </Typography>
      {item !== null && (
        <GaugeChart
          id={id}
          percent={item / 100} // Normalize temperature value to a percentage
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

export default GaugeChart;
