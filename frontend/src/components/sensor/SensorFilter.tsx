import { Button, FormControl, Grid, MenuItem, TextField } from '@mui/material';
import React from 'react';

interface SensorPaginationModel {
  page: number;
  pageSize: number;
}

interface SensorFilterProps {
  seasonFilter: string;
  setSeasonFilter: React.Dispatch<React.SetStateAction<string>>;
  paginationModel: SensorPaginationModel;
  setPaginationModel: React.Dispatch<
    React.SetStateAction<SensorPaginationModel>
  >;
  handleFilter: () => void;
}

const SensorFilter: React.FC<SensorFilterProps> = ({
  seasonFilter,
  setSeasonFilter,
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
      <Grid item sm={12} md={3} xs={4}>
        <FormControl fullWidth>
          <TextField
            label='Estações do Ano'
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
            {['Spring', 'Summer', 'Fall', 'Winter', 'Autumn'].map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </FormControl>
      </Grid>
      <Grid item sm={12} md={3} xs={4}>
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
      <Grid item sm={12} md={3} xs={4}>
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

      <Grid item sm={12} md={3} xs={4}>
        <Button
          variant='contained'
          color='primary'
          sx={{ mt: 2 }}
          onClick={handleFilter}
        >
          Aplicar Filto
        </Button>
      </Grid>
    </Grid>
  );
};

export default SensorFilter;
