import moment from 'moment';

export const columns = [
  { field: 'id', headerName: 'ID', width: 350 },
  {
    field: 'temperature',
    headerName: 'Temperatura',
    width: 150,
  },
  {
    field: 'humidity',
    headerName: 'Umidade',
    width: 150,
  },
  {
    field: 'season',
    headerName: 'Estações do Ano',
    width: 150,
  },
  {
    field: 'created_at',
    headerName: 'Criado',
    width: 150,
    valueGetter: (params: { created_at: moment.MomentInput }) =>
      `${moment(params.created_at).format('DD/MM/YYYY') || ''}`,
  },
  {
    field: 'updated_at',
    headerName: 'Atualizado',
    width: 150,
    valueGetter: (params: { updated_at: moment.MomentInput }) =>
      `${moment(params.updated_at).format('DD/MM/YYYY') || ''}`,
  },
];

export default columns;
