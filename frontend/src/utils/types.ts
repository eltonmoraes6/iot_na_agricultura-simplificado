export interface FilterItem {
  id: number;
  value: string;
}

export interface SortItem {
  id: number;
  value: string;
}

export interface SensorPaginationModel {
  page: number;
  pageSize: number;
}

export interface SensorFilterProps {
  filter: string;
  setFilter: React.Dispatch<React.SetStateAction<string>>;
  filterItem: FilterItem[];
  sort: string;
  sortItem: SortItem[];
  setSort: React.Dispatch<React.SetStateAction<string>>;
  sortOrder: 'ASC' | 'DESC';
  setSortOrder: React.Dispatch<React.SetStateAction<'ASC' | 'DESC'>>;
  fields: string;
  setFields: React.Dispatch<React.SetStateAction<string>>;
  paginationModel: SensorPaginationModel;
  setPaginationModel: React.Dispatch<
    React.SetStateAction<SensorPaginationModel>
  >;
  handleFilter: () => void;
}

// Define your types (adjust according to your actual data structures)
export interface WaterDeficiencyRequest {
  currentHumidity: number;
  fieldCapacity: number;
}

export interface WaterDeficiencyResponse {
  deficiency: number;
}

export interface PotentialEvapotranspirationRequest {
  kc: number;
  eto: number;
}

export interface PotentialEvapotranspirationResponse {
  etp: number;
}

export interface IdealTemperatureRequest {
  soilType: string;
}

export interface IdealTemperatureResponse {
  idealTemperature: number;
}
