import {
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useGetSensorsQuery } from '../redux/api/sensorApi';

const SensorList = () => {
  // Correctly pass the query parameters to the hook
  const { data, error, isLoading } = useGetSensorsQuery({
    // filters: { season: 'Summer' }, // Correctly defined filter
    // sort: { field: 'temperature', order: 'DESC' }, // Correctly defined sorting
    pagination: { page: 1, limit: 10 }, // Correctly defined pagination
  });

  console.log('Data -----> ', data);
  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    // Check if it's a FetchBaseQueryError and get status or other details
    if ('status' in error) {
      return (
        <Typography color='error'>
          Error: {error.status} -{' '}
          {typeof error.data === 'string' ? error.data : 'An error occurred'}
        </Typography>
      );
    } else if ('message' in error) {
      return <Typography color='error'>Error: {error.message}</Typography>;
    }

    return <Typography color='error'>An unexpected error occurred.</Typography>;
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Humidity</TableCell>
            <TableCell>Temperature</TableCell>
            <TableCell>Season</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.data.sensors.map((sensor) => (
            <TableRow key={sensor.id}>
              <TableCell>{sensor.id}</TableCell>
              <TableCell>{sensor.humidity}</TableCell>
              <TableCell>{sensor.temperature}</TableCell>
              <TableCell>{sensor.season}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SensorList;
