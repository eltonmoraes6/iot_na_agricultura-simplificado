export interface IMetric {
  id: string;
  minHumidity: number;
  maxHumidity: number;
  minTemperature: number;
  maxTemperature: number;
  season: string;
  soilType: string;
  created_at: string;
  updated_at: string;
}

export interface IMetricResponse {
  metrics: IMetric[];
}

export interface IAverages {
  period: string;
  average_temperature: number;
  average_humidity: number;
}
