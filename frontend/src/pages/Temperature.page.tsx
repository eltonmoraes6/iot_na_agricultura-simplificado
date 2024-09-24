import { createColumnHelper } from '@tanstack/react-table';
import ReusableSensorComponent from '../components/ReusableSensorComponent ';
import { useGetTemperaturesMutation } from '../redux/api/temperatureApi';
import { ITemperature } from '../redux/types/temperatureTypes';

const columnHelper = createColumnHelper<ITemperature>();

const temperatureColumns = [
  columnHelper.accessor('id', {
    header: 'ID',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('temperature', {
    header: 'Temperatura',
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

const temperatureFilterItems: { id: number; value: string }[] = [];

const temperatureSortItems = [
  { id: 0, value: 'id' },
  { id: 4, value: 'temperature' },
  { id: 5, value: 'created_at' },
  { id: 6, value: 'updated_at' },
];

const TemperaturePage = () => {
  const [getTemperatures] = useGetTemperaturesMutation();

  return (
    <ReusableSensorComponent<ITemperature>
      title='Temperatura'
      getMutation={getTemperatures}
      filterType=''
      filterItems={temperatureFilterItems}
      sortItems={temperatureSortItems}
      columns={temperatureColumns}
    />
  );
};

export default TemperaturePage;
