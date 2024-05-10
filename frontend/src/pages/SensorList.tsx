import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import { DataGrid, GridPaginationModel } from '@mui/x-data-grid';
import { useState } from 'react';
import {
  useGetAllSensorsQuery,
  useGetSensorsMutation,
} from '../redux/api/sensorApi';
import { ISensor } from '../redux/api/types';
import columns from './columns';

const SensorList = () => {
  // Define states for filter criteria, pagination, sorting, and selection
  const [seasonFilter, setSeasonFilter] = useState('');
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0, // Note: DataGrid uses zero-based indexing
    pageSize: 10,
  });
  const [filteredData, setFilteredData] = useState<ISensor[] | null>(null);
  // Load initial data with the query hook
  const {
    data: allSensorsData,
    error: allSensorsError,
    isLoading: allSensorsLoading,
  } = useGetAllSensorsQuery();

  // Use the mutation hook to fetch filtered data
  const [getSensors, { isLoading: sensorsLoading, error: sensorsError }] =
    useGetSensorsMutation();

  const handleFilter = async () => {
    const { page, pageSize } = paginationModel;

    // Convert 0-based index to 1-based for server-side pagination
    const pageNumber = page + 1;

    let queryString = `limit=${pageSize}&page=${pageNumber}`;

    if (seasonFilter) {
      queryString += `&season=${seasonFilter}`;
    }

    try {
      const result = (await getSensors(queryString).unwrap()) as ISensor[];
      if (result) {
        setFilteredData(result); // Store filtered data in state
      }
    } catch (error) {
      console.error('Error fetching filtered data:', error);
    }
  };

  // Render loading state
  if (allSensorsLoading || sensorsLoading) {
    return <CircularProgress />;
  }

  // Handle errors from both the initial query and the mutation
  if (allSensorsError || sensorsError) {
    const error = allSensorsError || sensorsError;
    if (error) {
      return (
        <Typography color='error'>An unexpected error occurred</Typography>
      );
    }
  }

  // Determine which data set to use for the DataGrid
  const dataToDisplay = filteredData ?? allSensorsData;

  return (
    <>
      <Box
        sx={{
          backgroundColor: '#ece9e9',
          // mt: '2rem',
          height: '15rem',
          textAlign: 'center',
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
          {/* Season Data Bar Chart */}
          Filtro de Dados
        </Typography>
      </Box>
      <Grid
        container
        rowSpacing={1}
        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
        sx={{ mb: 4 }}
      >
        <Grid item sm={12} md={3} xs={4}>
          <FormControl fullWidth>
            <TextField
              label='Season'
              variant='outlined'
              margin='normal'
              required
              fullWidth
              value={seasonFilter}
              select
              onChange={(e) => setSeasonFilter(e.target.value)}
              size='small'
              InputLabelProps={{
                shrink: true,
              }}
            >
              {['Spring', 'Summer', 'Fall', 'Winter', 'Autumn'].map(
                (option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                )
              )}
            </TextField>
          </FormControl>
        </Grid>
        <Grid item sm={12} md={3} xs={4}>
          <TextField
            label='Page'
            variant='outlined'
            margin='normal'
            type='number'
            value={paginationModel.page + 1} // Display 1-based index to user
            onChange={(e) =>
              setPaginationModel((prev) => ({
                ...prev,
                page: parseInt(e.target.value, 10) - 1,
              }))
            }
            size='small'
            fullWidth
          />
        </Grid>
        <Grid item sm={12} md={3} xs={4}>
          <TextField
            label='Limit'
            variant='outlined'
            margin='normal'
            type='number'
            value={paginationModel.pageSize}
            onChange={(e) =>
              setPaginationModel((prev) => ({
                ...prev,
                pageSize: parseInt(e.target.value, 10),
              }))
            }
            size='small'
            fullWidth
          />
        </Grid>

        <Grid item sm={12} md={3} xs={4}>
          <Button
            variant='contained'
            color='primary'
            sx={{ mt: 2 }}
            onClick={handleFilter}
          >
            Apply Filters
          </Button>
        </Grid>
      </Grid>

      <Box
        style={{
          height: 'auto',
          width: '100%',
          marginBottom: '50px',
        }}
      >
        <DataGrid
          autoHeight
          getRowId={(row) => row.id}
          rows={dataToDisplay ?? []}
          columns={columns}
          checkboxSelection
          pagination
          pageSizeOptions={[5, 10, 20, 40, 80, 100]}
          // paginationModel={paginationModel}
          onPaginationModelChange={(newModel) => setPaginationModel(newModel)}
        />
      </Box>
    </>
  );
};

export default SensorList;
