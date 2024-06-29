export interface PaginationModel {
  page: number;
  pageSize: number;
}

export interface GenericResponse {
  status: string;
  message: string;
}

export interface ISensor {
  id: string;
  humidity: number;
  temperature: number;
  season: string;
  created_at: string;
  updated_at: string;
  soil?: {
    id: string;
    soilType: string;
    minHumidity: number; // Ponto de Murcha Permanente => PMP => Limite mínimo de umidade do solo para as plantas
    maxHumidity: number; // Capacidade de Campo => CC => Limite máximo de umidade do solo para as plantas
    minTemperature: number;
    maxTemperature: number;
    sensor: string;
  };
}

export interface ISensorResponse {
  sensors: ISensor[];
}

export interface ISoil {
  id: string;
  soilType: string;
  minHumidity: number; // Ponto de Murcha Permanente => PMP => Limite mínimo de umidade do solo para as plantas
  maxHumidity: number; // Capacidade de Campo => CC => Limite máximo de umidade do solo para as plantas
  minTemperature: number;
  maxTemperature: number;
  sensor: string;
  created_at: string;
  updated_at: string;
}

export interface ISoilResponse {
  soils: ISoil[];
}

export interface IWeather {
  id: string;
  lat: number;
  lon: number;
  temp: number;
  description: string;
  created_at: string;
  updated_at: string;
  humidity: number;
  pressure: number;
  wind_speed: number;
  name: string;
  feels_like: number;
}

export interface IWeatherResponse {
  weather: IWeather[];
}

// Interface to represent a sensor reading
export interface ISensorData {
  temperature: number;
  humidity: number;
  created_at: string;
  period: string; // 'morning', 'afternoon', 'night'
}

// Interface for period-based averages
export interface IPeriodAverage {
  period: string;
  average_temperature: number;
  average_humidity: number;
  sensor_data: ISensorData[];
}

// Interface for the overall response structure
export interface IDailyAndPeriodAveragesResponse {
  map(arg0: (item: IPeriodAverage) => string): unknown;
  status: string;
  data: IPeriodAverage[];
}
