import { Box, Typography } from '@mui/material';
import React from 'react';

interface PageTitleProps {
  title: string;
}

export const PageTitle: React.FC<PageTitleProps> = ({ title }) => {
  return (
    <Box
      sx={{
        backgroundColor: '#ece9e9',
        // mt: '2rem',
        height: '8rem',
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Typography
        variant='h2'
        component='h1'
        sx={{
          color: '#1f1e1e',
          fontWeight: 500,
          marginLeft: 1,
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'scale(1.25)',
            transformOrigin: 'center center', // Change transform origin to right side
          },
        }}
      >
        {/* Season Data Bar Chart */}
        {title}
      </Typography>
    </Box>
  );
};

export default PageTitle;
