import { Box, Paper } from '@mui/material';
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
import '../styles/dataTable.css';
import SensorDataTable from './SensorDataTable'; // import the new SensorDataTable component

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
  width: '90%', // Adjusted width for mobile responsiveness
  maxWidth: '600px', // Maximum width to prevent excessive enlargement
}));

const columnHelper = createColumnHelper<ISoil>();

const SoilDataTable = ({ data }: { data: ISoil[] }) => {
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
    columnHelper.accessor('id', {
      header: () => 'ID',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('minTemperature', {
      header: () => 'Temperatura Mínima',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('maxTemperature', {
      header: () => 'Temperatura Máxia',
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
        <button onClick={() => handleToggle(info.row.original.id)}>
          {isCardVisible(info.row.original.id)
            ? 'Ocultar Sensores'
            : 'Mostrar Sensores'}
        </button>
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
    <Box sx={{ mt: 4 }}>
      <div className='data-table-container'>
        <div className='search-bar'>
          <form>
            <input
              type='text'
              placeholder='Buscar...'
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </form>
        </div>
        <div className='data-table-wrapper'>
          <table className='data-table'>
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className='data-table-cell'>
                      <div
                        {...{
                          className: header.column.getCanSort()
                            ? 'cursor-pointer select-none'
                            : '',
                          onClick: header.column.getToggleSortingHandler(),
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
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className='data-table-cell'>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                  {isCardVisible(row.original.id) && (
                    <FloatingCard ref={floatingCardRef}>
                      <SensorDataTable
                        data={row.original.sensor as ISensor[]}
                      />
                    </FloatingCard>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className='pagination'>
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {'<'}
          </button>
          <span>
            Page{' '}
            <strong>
              {table.getState().pagination.pageIndex + 1} of{' '}
              {table.getPageCount()}
            </strong>{' '}
          </span>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {'>'}
          </button>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>
      </div>
    </Box>
  );
};

export default SoilDataTable;
