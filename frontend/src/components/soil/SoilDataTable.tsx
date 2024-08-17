import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  PaginationState,
  SortingState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import { ISensor, ISoil } from '../../redux/api/types';
import SensorDataTable from './SensorDataTable'; // Import the SensorDataTable component

import '../../styles/dataTable.css';
const FloatingCard = styled(Paper)(({ theme }) => ({
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  zIndex: 1000,
  padding: theme.spacing(2),
  backgroundColor: theme.palette.primary.light,
  boxShadow: theme.shadows[5],
  maxHeight: '80vh',
  overflowY: 'auto',
  width: '90%',
  maxWidth: '600px',
}));

const columnHelper = createColumnHelper<ISoil>();

const SoilDataTable = ({ data }: { data: ISoil[] }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [searchValue, setSearchValue] = useState('');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [visibleCardId, setVisibleCardId] = useState<string | null>(null);
  const floatingCardRef = useRef<HTMLDivElement | null>(null);

  const handleToggle = (soilId: string) => {
    setVisibleCardId((prevId) => (prevId === soilId ? null : soilId));
  };

  const isCardVisible = (soilId: string) => visibleCardId === soilId;

  const handleClickOutside = (event: MouseEvent) => {
    if (
      floatingCardRef.current &&
      !floatingCardRef.current.contains(event.target as Node)
    ) {
      setVisibleCardId(null);
    }
  };

  useEffect(() => {
    if (visibleCardId) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [visibleCardId]);

  const columns = [
    columnHelper.accessor('minTemperature', {
      header: () => 'Temperatura Mínima',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('maxTemperature', {
      header: () => 'Temperatura Máxima',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('minHumidity', {
      header: () => 'Umidade Mínima',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('maxHumidity', {
      header: () => 'Umidade Máxima',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('soilType', {
      header: () => 'Tipo de Solo',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('created_at', {
      header: () => 'Criação',
      cell: (info) => moment(info.getValue()).format('DD/MM/YYYY'),
    }),
    columnHelper.accessor('updated_at', {
      header: () => 'Edição',
      cell: (info) => moment(info.getValue()).format('DD/MM/YYYY'),
    }),
    columnHelper.accessor('sensor', {
      header: () => 'Ações',
      cell: (info) => (
        <Button
          size='small'
          variant='contained'
          color='primary'
          onClick={() => handleToggle(info.row.original.id)}
        >
          {isCardVisible(info.row.original.id)
            ? 'Ocultar Sensores'
            : 'Mostrar Sensores'}
        </Button>
      ),
    }),
  ];

  const table = useReactTable({
    data: data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      pagination,
      globalFilter: searchValue,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onGlobalFilterChange: setSearchValue,
  });

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <TextField
          type='text'
          placeholder='Buscar...'
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          fullWidth
          variant='outlined'
          size='small'
        />
      </Box>
      <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
        <Table className='data-table'>
          <TableHead>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableCell
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    sx={{
                      cursor: header.column.getCanSort() ? 'pointer' : 'auto',
                      whiteSpace: 'nowrap',
                      minWidth: isMobile ? 100 : 'auto', // Adjust minWidth for mobile
                    }}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {{
                      asc: ' 🔼',
                      desc: ' 🔽',
                    }[header.column.getIsSorted() as string] ?? null}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
                {isCardVisible(row.original.id) && (
                  <TableCell colSpan={columns.length}>
                    <FloatingCard ref={floatingCardRef}>
                      <SensorDataTable
                        data={row.original.sensor as ISensor[]}
                      />
                    </FloatingCard>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ mt: 2 }}>
        <TablePagination
          component='div'
          count={table.getFilteredRowModel().rows.length}
          page={table.getState().pagination.pageIndex}
          onPageChange={(_event, newPage) => table.setPageIndex(newPage)}
          rowsPerPage={table.getState().pagination.pageSize}
          onRowsPerPageChange={(event) =>
            table.setPageSize(Number(event.target.value))
          }
          rowsPerPageOptions={[5, 10, 20, 30, 40, 50]}
          labelRowsPerPage='Mostrar'
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} de ${count}`
          }
        />
      </Box>
    </Box>
  );
};

export default SoilDataTable;
