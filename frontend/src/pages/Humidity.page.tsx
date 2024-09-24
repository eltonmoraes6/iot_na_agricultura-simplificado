import { createColumnHelper } from '@tanstack/react-table';
import ReusableSensorComponent from '../components/ReusableSensorComponent ';
import { useGetHumiditiesMutation } from '../redux/api/humidityApi';
import { IHumidity } from '../redux/types/humidityTypes';

const columnHelper = createColumnHelper<IHumidity>();

const humidityColumns = [
  columnHelper.accessor('id', {
    header: 'ID',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('humidity', {
    header: 'Umidade',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('created_at', {
    header: 'Criação',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('updated_at', {
    header: 'Edição',
    cell: (info) => info.getValue(),
  }),
];

const humidityFilterItems: { id: number; value: string }[] = [];

const humiditySortItems = [
  { id: 0, value: 'id' },
  { id: 4, value: 'humidity' },
  { id: 5, value: 'created_at' },
  { id: 6, value: 'updated_at' },
];

const HumidityPage = () => {
  const [getHumidities] = useGetHumiditiesMutation();

  return (
    <ReusableSensorComponent<IHumidity>
      title='Umidade'
      getMutation={getHumidities}
      filterType=''
      filterItems={humidityFilterItems}
      sortItems={humiditySortItems}
      columns={humidityColumns}
    />
  );
};

export default HumidityPage;
