import { createColumnHelper } from '@tanstack/react-table';
import moment from 'moment';
import ReusableSensorComponent from '../components/ReusableSensorComponent ';
import { useGetSoilsMutation } from '../redux/api/soilApi';
import { ISoil } from '../redux/types/soilTypes';

const columnHelper = createColumnHelper<ISoil>();

const soilColumns = [
  columnHelper.accessor('id', {
    header: 'ID',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('soilType', {
    header: 'Tipo de Solo',
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

const soilFilterItems = [
  { id: 1, value: 'Latossolos' },
  { id: 2, value: 'Argissolos' },
  { id: 3, value: 'Neossolos' },
];

const soilSortItems = [
  { id: 0, value: 'id' },
  { id: 4, value: 'soilType' },
  { id: 5, value: 'created_at' },
  { id: 6, value: 'updated_at' },
];

const SoilPage = () => {
  const [getSoils] = useGetSoilsMutation();

  return (
    <ReusableSensorComponent<ISoil>
      title='Tipo de Solo'
      getMutation={getSoils}
      filterType='soilType'
      filterItems={soilFilterItems}
      sortItems={soilSortItems}
      columns={soilColumns}
    />
  );
};

export default SoilPage;
