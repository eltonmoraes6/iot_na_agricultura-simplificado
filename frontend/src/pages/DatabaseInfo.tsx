import { Box, Container, Grid, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';

import moment from 'moment';
import Filter from '../components/Filter';
import FullScreenLoader from '../components/FullScreenLoader';
import PageTitle from '../components/PageTitle';
import DataTable from '../components/sensor/DataTable';
import { useGetSensorsMutation } from '../redux/api/sensorApi';
import { ISensor, PaginationModel } from '../redux/api/types';
import { filterItems, sortItem } from '../utils/filterInfo';

const DatabaseInfo = () => {
  // Define states for filter criteria, pagination, sorting, and selection
  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState('created_at'); // Default sort field
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('ASC');
  const [fields, setFields] = useState('');
  const [paginationModel, setPaginationModel] = useState<PaginationModel>({
    page: 0,
    pageSize: 10,
  });

  const [filteredData, setFilteredData] = useState<ISensor[] | null>(null);

  // Use the mutation hook to fetch filtered data
  const [getSensors, { isLoading: sensorsLoading, error: sensorsError }] =
    useGetSensorsMutation();

  const fetchSensors = useCallback(
    async (queryString: string) => {
      try {
        const result = (await getSensors(queryString).unwrap()) as ISensor[];
        if (result) {
          setFilteredData(result);
        }
      } catch (error) {
        console.error('Error fetching filtered data:', error);
      }
    },
    [getSensors]
  );

  useEffect(() => {
    const { page, pageSize } = paginationModel;
    const pageNumber = page + 1;
    let queryString = `limit=${pageSize}&page=${pageNumber}&sortOrder=${sortOrder}&sort=${sort}&fields=${fields}`;

    if (filter) {
      queryString += `&season=${filter}`;
    }

    fetchSensors(queryString);
  }, [filter, sort, sortOrder, fields, paginationModel, fetchSensors]);

  const handleFilter = async () => {
    const { page, pageSize } = paginationModel;

    // Convert 0-based index to 1-based for server-side pagination
    const pageNumber = page + 1;

    let queryString = `limit=${pageSize}&page=${pageNumber}&sortOrder=${sortOrder}&sort=${sort}&fields=${fields}`;

    if (filter) {
      queryString += `&season=${filter}`;
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
  if (sensorsLoading) {
    return <FullScreenLoader />;
  }

  // Handle errors from both the initial query and the mutation
  if (sensorsError) {
    const error = sensorsError;
    if (error) {
      return (
        <Typography color='error'>An unexpected error occurred</Typography>
      );
    }
  }

  // Determine which data set to use for the DataGrid
  const dataToDisplay = filteredData;

  // Convert data to IDataTable format for DataTable component
  const dataTableData =
    dataToDisplay?.map((sensor) => ({
      id: sensor.id,
      temperature: sensor.temperature,
      season: sensor.season,
      humidity: sensor.humidity,
      created_at: moment(sensor.created_at).format('DD/MM/YYYY'),
      updated_at: moment(sensor.updated_at).format('DD/MM/YYYY'),
      soil: sensor.soil,
    })) ?? [];

  return (
    <>
      <PageTitle title={'Banco de Dados'} />

      <Box
        style={{
          height: 'auto',
          width: '100%',
          marginBottom: '50px',
        }}
      >
        <Filter
          filterItem={filterItems}
          filter={filter}
          setFilter={setFilter}
          sort={sort}
          sortItem={sortItem}
          setSort={setSort}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          fields={fields}
          setFields={setFields}
          paginationModel={paginationModel}
          setPaginationModel={setPaginationModel}
          handleFilter={handleFilter}
        />
        <Grid container spacing={2} mb={4}>
          <Container maxWidth={false}>
            <DataTable data={dataTableData || []} />
          </Container>
        </Grid>
      </Box>
    </>
  );
};

export default DatabaseInfo;
