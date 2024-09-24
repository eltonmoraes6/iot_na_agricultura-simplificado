import { Box } from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import DataTable from '../components/DataTable';
import SensorFilter from '../components/Filter';
import FullScreenLoader from '../components/FullScreenLoader';
import PageTitle from '../components/PageTitle';
import { PaginationModel } from '../redux/api/types';

interface ReusableSensorComponentProps<T> {
  title: string;
  getMutation: (query: string) => Promise<{ data?: T[]; error?: unknown }>;
  filterItems: Array<{ id: number; value: string }>;
  sortItems: Array<{ id: number; value: string }>;
  columns: unknown[];
  filterType: string;
}
const ReusableSensorComponent = <T,>({
  title,
  getMutation,
  filterItems,
  sortItems,
  columns,
  filterType,
}: ReusableSensorComponentProps<T>) => {
  // Common state management
  const [filter, setFilter] = useState('');

  const [sort, setSort] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');
  const [fields, setFields] = useState('');
  const [pagination, setPagination] = useState<PaginationModel>({
    page: 0,
    pageSize: 10,
  });

  const [filteredData, setFilteredData] = useState<T[] | null>(null);

  const fetchData = useCallback(
    async (queryString: string) => {
      try {
        const result = await getMutation(queryString); // result contains { data } or { error }
        if ('data' in result && result.data) {
          setFilteredData(result.data); // Set the actual humidities array
        }
      } catch (error) {
        console.error(`Error fetching ${title} data:`, error);
      }
    },
    [getMutation, title]
  );

  useEffect(() => {
    const { page, pageSize } = pagination;
    const pageNumber = page + 1;
    let queryString = `limit=${pageSize}&page=${pageNumber}&sortOrder=${sortOrder}&sort=${sort}&fields=${fields}`;

    if (filter) {
      queryString += `&${filterType}=${filter}`;
    }

    fetchData(queryString);
  }, [filter, fetchData, pagination, sortOrder, sort, fields, filterType]);

  const handleFilter = () => {
    const { page, pageSize } = pagination;
    const pageNumber = page + 1;
    let queryString = `limit=${pageSize}&page=${pageNumber}&sortOrder=${sortOrder}&sort=${sort}&fields=${fields}`;
    if (filter) {
      queryString += `&${filterType}=${filter}`;
    }

    fetchData(queryString);
  };

  const dataToDisplay = filteredData;

  const dataTable: T[] = useMemo(() => {
    return (
      dataToDisplay?.map((item) => ({
        ...item,
      })) ?? []
    );
  }, [dataToDisplay]);

  if (!dataToDisplay) {
    return <FullScreenLoader />;
  }

  return (
    <Box sx={{ overflowX: 'auto' }}>
      <PageTitle title={title} />
      <SensorFilter
        filterItem={filterItems}
        filter={filter}
        setFilter={setFilter}
        sort={sort}
        sortItem={sortItems}
        setSort={setSort}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        fields={fields}
        setFields={setFields}
        paginationModel={pagination}
        setPaginationModel={setPagination}
        handleFilter={handleFilter}
      />
      <DataTable columns={columns} data={dataTable || []} />
    </Box>
  );
};

export default ReusableSensorComponent;
