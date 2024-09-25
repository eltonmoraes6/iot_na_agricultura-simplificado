export interface ISettings {
  status: string;
  data: [];
}

export interface ISettingsResponse {
  settings: ISettings[];
}

export interface IConfigSettings {
  BAUD_RATE: string;
  COM_PORT: string;
  KAFKA_BROKERS: string;
  OPEN_WEATHER_MAP_API_KEY: string;
  POSTGRES_DB: string;
  POSTGRES_HOST: string;
  POSTGRES_PASSWORD: string;
  POSTGRES_PORT: string;
  POSTGRES_USER: string;
}
