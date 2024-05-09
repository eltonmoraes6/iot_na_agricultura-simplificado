import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
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
      <Grid
        container
        rowSpacing={1}
        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
        sx={{ mb: 4 }}
      >
        <Grid item sm={12} md={3} xs={4}>
          <FormControl fullWidth>
            <InputLabel>Season</InputLabel>
            <Select
              value={seasonFilter}
              onChange={(e) => setSeasonFilter(e.target.value)}
              size='small'
            >
              <MenuItem value='Spring'>Spring</MenuItem>
              <MenuItem value='Summer'>Summer</MenuItem>
              <MenuItem value='Fall'>Fall</MenuItem>
              <MenuItem value='Winter'>Winter</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item sm={12} md={3} xs={4}>
          <TextField
            label='Page'
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
          <Button variant='contained' color='primary' onClick={handleFilter}>
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
          pagination
          checkboxSelection
          paginationModel={paginationModel}
          onPaginationModelChange={(newModel) => setPaginationModel(newModel)}
        />
      </Box>
    </>
  );
};

export default SensorList;
