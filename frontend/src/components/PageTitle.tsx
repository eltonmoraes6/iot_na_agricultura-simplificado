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
        height: { xs: '6rem', md: '8rem' }, // Adjust height for different screen sizes
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: { xs: '0 1rem', md: '0 2rem' }, // Adjust padding for better responsiveness
      }}
    >
      <Typography
        variant='h4' // Adjusted typography variant for better responsiveness
        component='h1'
        sx={{
          color: '#1f1e1e',
          fontWeight: 500,
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'scale(1.25)',
            transformOrigin: 'center center', // Change transform origin to center
          },
        }}
      >
        {title}
      </Typography>
    </Box>
  );
};

export default PageTitle;
