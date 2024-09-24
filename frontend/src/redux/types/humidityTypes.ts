export interface IHumidity {
  id: string;
  humidity: number;
  created_at: string;
  updated_at: string;
}

export interface IHumidityResponse {
  humidities: IHumidity[];
}
