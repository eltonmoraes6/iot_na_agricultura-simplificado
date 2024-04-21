import { Box, Container, Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

import { useEffect } from 'react';
import { toast } from 'react-toastify';
import FullScreenLoader from '../components/FullScreenLoader';
import Message from '../components/Message';
import { useGetAllSensorsQuery } from '../redux/api/sensorApi';
import { ISensorResponse } from '../redux/api/types';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const columns: GridColDef<ISensorResponse>[] = [
  { field: 'id', headerName: 'ID', width: 300 },
  {
    field: 'humidity',
    headerName: 'Humidity',
    type: 'number',
    width: 150,
    editable: true,
  },
  {
    field: 'temperature',
    headerName: 'Temperature',
    type: 'number',
    width: 150,
    editable: true,
  },
  {
    field: 'season',
    headerName: 'Season',
    type: 'string',
    width: 150,
    editable: true,
  },
];

const DatabaseInfo = () => {
  const { isLoading, isError, error, data: sensors } = useGetAllSensorsQuery();

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

  if (isLoading) {
    return <FullScreenLoader />;
  }

  return (
    <Container
      maxWidth={false}
      sx={{ backgroundColor: '#fff', height: '100vh' }}
    >
      {sensors?.length === 0 ? (
        <Box maxWidth='sm' sx={{ mx: 'auto', py: '5rem' }}>
          <Message type='info' title='Info'>
            No Database Info at the moment
          </Message>
        </Box>
      ) : (
        <>
          <Box
            sx={{
              backgroundColor: '#ece9e9',
              mt: '2rem',
              height: '15rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography
              variant='h2'
              component='h1'
              sx={{ color: '#1f1e1e', fontWeight: 500 }}
            >
              Database Info
            </Typography>
          </Box>
          <Box sx={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={sensors}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 10,
                  },
                },
              }}
              pageSizeOptions={[5, 10]}
              checkboxSelection
              disableRowSelectionOnClick
            />
          </Box>
        </>
      )}
    </Container>
  );
};

export default DatabaseInfo;
