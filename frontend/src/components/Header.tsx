import { LoadingButton as _LoadingButton } from '@mui/lab';
import { AppBar, Box, Container, Toolbar, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const LoadingButton = styled(_LoadingButton)`
  padding: 0.4rem;
  color: #222;
  font-weight: 500;
  border: 2px solid #222;
  margin-right: 1rem;

  &:hover {
    transform: translateY(-2px);
  }
`;

const Header = () => {
  const navigate = useNavigate();
  const isError = false;

  const isLoading = false;

  useEffect(() => {
    if (isError) {
      if (Array.isArray((error as any).data.error)) {
        (error as any).data.error.forEach((el: any) =>
          toast.error(el.message, {
            position: 'top-right',
          })
        );
      } else {
        toast.error((error as any).data.message, {
          position: 'top-right',
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  return (
    <>
      <AppBar position='static' sx={{ backgroundColor: '#fff' }}>
        <Container maxWidth='lg'>
          <Toolbar>
            <Typography
              variant='h6'
              onClick={() => navigate('/')}
              sx={{ cursor: 'pointer', color: '#222', fontWeight: 700 }}
            >
              3Claves
            </Typography>
            <Box display='flex' sx={{ ml: 'auto' }}>
              <>
                <LoadingButton
                  onClick={() => navigate('/daily-and-period-averages')}
                >
                  DailyAndPeriodAveragesPage
                </LoadingButton>
                <LoadingButton
                  onClick={() => navigate('/season-data-bar-chart')}
                >
                  SeasonDataBarChart
                </LoadingButton>

                <LoadingButton onClick={() => navigate('/database-info')}>
                  DatabaseInfo
                </LoadingButton>
              </>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
};

export default Header;
