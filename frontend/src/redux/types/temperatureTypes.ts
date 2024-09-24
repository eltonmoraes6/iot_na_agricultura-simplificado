export interface ITemperature {
  id: string;
  temperature: number;
  created_at: string;
  updated_at: string;
}

export interface ITemperatureResponse {
  temperatures: ITemperature[];
}
