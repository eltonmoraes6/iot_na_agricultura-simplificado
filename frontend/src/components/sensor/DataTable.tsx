import { Box } from '@mui/material';
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
import { useState } from 'react';
import { ISensor } from '../../redux/api/types';
import '../styles/dataTable.css';

const columnHelper = createColumnHelper<ISensor>();

const columns = [
  columnHelper.accessor('id', {
    header: () => 'ID',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('temperature', {
    header: () => 'Temperatura',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('humidity', {
    header: () => 'Umidade',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('season', {
    header: () => 'Estações do Ano',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('created_at', {
    header: () => 'Criação',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('updated_at', {
    header: () => 'Edição',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('soil', {
    header: () => 'Solo',
    cell: (info) => info.getValue()?.soilType || 'N/A',
  }),
  columnHelper.accessor('soil', {
    header: () => 'Umidade Máxima',
    cell: (info) => info.getValue()?.maxHumidity || 'N/A',
  }),
];

const DataTable = ({ data }: { data: ISensor[] }) => {
  const [searchValue, setSearchValue] = useState('');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

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
      <div className='table-container'>
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
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
    </Box>
  );
};

export default DataTable;
