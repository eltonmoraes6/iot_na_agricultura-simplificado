import OpacityIcon from '@mui/icons-material/Opacity';
import { Box, Typography } from '@mui/material';
import React from 'react';

import './water.css';

type WaterFlowIndicatorProps = {
  isIrrigated: boolean;
  waterFlowRate: number; // in liters per minute
  totalWaterUsed: number; // in liters
};

const WaterFlowIndicator: React.FC<WaterFlowIndicatorProps> = ({
  isIrrigated,
  waterFlowRate,
  totalWaterUsed,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '10px',
        textAlign: 'center',
      }}
    >
      <OpacityIcon
        sx={{
          fontSize: 48,
          color: isIrrigated ? '#4caf50' : '#bdbdbd',
          animation: isIrrigated ? 'pulse 2s infinite' : 'none',
        }}
      />
      <Typography variant='h6' sx={{ marginTop: '10px', fontWeight: 'bold' }}>
        {isIrrigated ? 'Irrigating' : 'Not Irrigating'}
      </Typography>
      {isIrrigated && (
        <Typography variant='body1' sx={{ marginTop: '5px' }}>
          Water Flow Rate: {waterFlowRate} L/min
        </Typography>
      )}
      <Typography variant='body2' sx={{ marginTop: '10px', color: '#757575' }}>
        Total Water Used: {totalWaterUsed} L
      </Typography>
    </Box>
  );
};

export default WaterFlowIndicator;
