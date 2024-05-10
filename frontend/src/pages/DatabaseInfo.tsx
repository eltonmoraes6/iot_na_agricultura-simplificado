import { Alert, Box, Container, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

import FullScreenLoader from '../components/FullScreenLoader';
import Message from '../components/Message';
import { useGetAllSensorsQuery } from '../redux/api/sensorApi';
import { ISensor } from '../redux/api/types';

const columns: GridColDef<ISensor>[] = [
  { field: 'id', headerName: 'ID', width: 300 },
  {
    field: 'humidity',
    headerName: 'Umidade',
    type: 'number',
    width: 150,
    editable: true,
  },
  {
    field: 'temperature',
    headerName: 'Temperatura',
    type: 'number',
    width: 150,
    editable: true,
  },
  {
    field: 'season',
    headerName: 'Estações do Ano',
    type: 'string',
    width: 150,
    editable: true,
  },
];

const DatabaseInfo = () => {
  const { isLoading, isError, error, data: sensors } = useGetAllSensorsQuery();

  if (isLoading) {
    return <FullScreenLoader />;
  }

  if (isError || !sensors) {
    return (
      <Box textAlign='center' mt={4}>
        <Alert severity='error'>Failed to fetch data</Alert>{' '}
        {/* Show an error message */}
      </Box>
    );
  }

  // Check if data is an array before using .map
  if (!Array.isArray(sensors)) {
    return (
      <Box textAlign='center' mt={4}>
        <Alert severity='warning'>No data available</Alert>
        <Typography
          variant='h2'
          component='h1'
          sx={{ color: '#1f1e1e', fontWeight: 500 }}
        >
          {error}
        </Typography>
      </Box>
    );
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
              // mt: '2rem',
              height: '15rem',
              display: 'flex',
              textAlign: 'center',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography
              variant='h2'
              component='h1'
              sx={{ color: '#1f1e1e', fontWeight: 500 }}
            >
              {/* Database Info */}
              Informações do Banco de Dados
            </Typography>
          </Box>
          <Box sx={{ height: 400, width: '100%' }}>
            <DataGrid
              autoHeight
              rows={sensors}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 10,
                  },
                },
              }}
              pageSizeOptions={[5, 10, 20, 40, 80, 100]}
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
