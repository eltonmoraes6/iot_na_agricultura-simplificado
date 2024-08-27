import { CircularProgress, Container } from '@mui/material';

const FullScreenLoader = () => {
  return (
    <Container
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh', // Optional: If you want the loader to cover the entire viewport
      }}
    >
      <CircularProgress size={120} />
    </Container>
  );
};

export default FullScreenLoader;
