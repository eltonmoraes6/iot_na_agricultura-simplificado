import { Box, Container, Typography } from '@mui/material';

import pageNotFound from '../assets/pageNotFound.svg';

const NotFound = () => {
  return (
    <>
      <title>
        <title>404</title>
      </title>
      <Box
        display='flex'
        flexDirection='column'
        height='100%'
        justifyContent='center'
      >
        <Container maxWidth='md'>
          <Typography
            sx={{
              fontSize: '35px',
              lineHeight: 1.167,
              letterSpacing: '-0.24px',
              textAlign: 'center',
            }}
            align='center'
            color='textPrimary'
            variant='h1'
          >
            404: A página que você está procurando não está aqui
          </Typography>
          <Typography
            align='center'
            color='textPrimary'
            variant='subtitle2'
            sx={{ marginBottom: 4 }}
          >
            Você pode ter tentado acessar uma rota inválida ou chegou aqui por
            engano. Seja qual for o caso, tente usar a navegação.
          </Typography>
          <Box textAlign='center'>
            <img
              src={pageNotFound}
              alt='Not FoundImg'
              style={{ display: 'inline-block', marginTop: 4 }}
              width={560}
            />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default NotFound;
