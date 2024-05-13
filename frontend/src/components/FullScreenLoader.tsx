import { CircularProgress, Container } from '@mui/material';

const FullScreenLoader = () => {
  return (
    <Container
      sx={{
        height: '100vh', // Change to 100vh to cover the entire viewport height
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <CircularProgress />
    </Container>
  );
};

export default FullScreenLoader;
