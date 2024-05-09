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
}

export interface ISensorResponse {
  sensors: ISensor[];
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
