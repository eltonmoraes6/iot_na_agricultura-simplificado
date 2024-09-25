import { createColumnHelper } from '@tanstack/react-table';
import moment from 'moment';
import ReusableSensorComponent from '../components/ReusableSensorComponent ';
import { useGetSeasonsMutation } from '../redux/api/seasonApi';
import { ISeason } from '../redux/types/seasonTypes';

const columnHelper = createColumnHelper<ISeason>();

const seasonColumns = [
  columnHelper.accessor('id', {
    header: 'ID',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('season', {
    header: 'Estções do Ano',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('created_at', {
    header: 'Criação',
    cell: (info) => moment(info.getValue()).format('DD/MM/YYYY HH:mm:ss'), // Format using moment
  }),
  columnHelper.accessor('updated_at', {
    header: 'Edição',
    cell: (info) => moment(info.getValue()).format('DD/MM/YYYY HH:mm:ss'), // Format using moment
  }),
];

const seasonFilterItems = [
  { id: 1, value: 'Summer' },
  { id: 2, value: 'Fall' },
  { id: 3, value: 'Winter' },
  { id: 4, value: 'Spring' },
];

const seasonSortItems = [
  { id: 0, value: 'id' },
  { id: 4, value: 'season' },
  { id: 5, value: 'created_at' },
  { id: 6, value: 'updated_at' },
];

const SeasonPage = () => {
  const [getSeasons] = useGetSeasonsMutation();

  return (
    <ReusableSensorComponent<ISeason>
      title='Estções do Ano'
      getMutation={getSeasons}
      filterType='season'
      filterItems={seasonFilterItems}
      sortItems={seasonSortItems}
      columns={seasonColumns}
    />
  );
};

export default SeasonPage;
