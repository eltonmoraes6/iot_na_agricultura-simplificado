import { Button, FormControl, Grid, MenuItem, TextField } from '@mui/material';
import React from 'react';
import { SensorFilterProps } from '../utils/types';

const Filter: React.FC<SensorFilterProps> = ({
  filter,
  setFilter,
  filterItem,
  sortItem,
  sort,
  setSort,
  sortOrder,
  setSortOrder,
  fields,
  setFields,
  paginationModel,
  setPaginationModel,
  handleFilter,
}) => {
  return (
    <Grid
      container
      rowSpacing={1}
      columnSpacing={{ xs: 1, sm: 2, md: 3 }}
      sx={{ mb: 4 }}
    >
      <Grid item sm={6} md={2} xs={4}>
        <FormControl fullWidth>
          <TextField
            label='Filtrar por'
            variant='outlined'
            margin='normal'
            required
            fullWidth
            value={filter}
            select
            onChange={(e) => setFilter(e.target.value)}
            size='small'
            InputLabelProps={{
              shrink: true,
            }}
          >
            {filterItem.map((option) => (
              <MenuItem key={option.id} value={option.value}>
                {option.value}
              </MenuItem>
            ))}
          </TextField>
        </FormControl>
      </Grid>
      <Grid item sm={6} md={1} xs={4}>
        <TextField
          label='Página'
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
      <Grid item sm={6} md={1} xs={4}>
        <TextField
          label='Limite'
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
      <Grid item sm={6} md={2} xs={4}>
        <TextField
          label='Ordenar por'
          variant='outlined'
          margin='normal'
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          size='small'
          fullWidth
          select
        >
          {sortItem.map((option) => (
            <MenuItem key={option.id} value={option.value}>
              {option.value}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item sm={6} md={2} xs={4}>
        <TextField
          label='Ordem'
          variant='outlined'
          margin='normal'
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as 'ASC' | 'DESC')}
          size='small'
          fullWidth
          select
        >
          {['ASC', 'DESC'].map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item sm={6} md={2} xs={4}>
        <TextField
          label='Campos'
          variant='outlined'
          margin='normal'
          value={fields}
          onChange={(e) => setFields(e.target.value)}
          size='small'
          fullWidth
          placeholder='Ex: temperature,humidity'
        />
      </Grid>
      <Grid item sm={6} md={2} xs={4}>
        <Button
          variant='contained'
          color='primary'
          sx={{ mt: 2 }}
          onClick={handleFilter}
        >
          Aplicar Filtro
        </Button>
      </Grid>
    </Grid>
  );
};

export default Filter;
