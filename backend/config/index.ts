import { config as dotenvConfig } from 'dotenv';
import fs from 'fs';
import path from 'path';
dotenvConfig();

interface PostgresConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

interface Config {
  port: number;
  postgresConfig: PostgresConfig;
  openWeatherMap: {
    apiKey: string;
  };
  serialPortConfig: {
    baudRate: string;
    comPort: string;
  };
  cors: { origin: string[] };
  kafkaConfig: {
    clientId: string;
    brokers: string[];
  };
}

// Load JSON configuration
const jsonConfigPath = path.join(__dirname, '../src/config/config.json');
const jsonConfig = JSON.parse(fs.readFileSync(jsonConfigPath, 'utf8'));
console.log('jsonConfig ======> ', jsonConfig);

const config: Config = {
  cors: {
    origin: [
      'http://localhost:3000',
      'http://localhost:8080',
      'http://localhost:80',
      'http://localhost:8100',
    ],
  }, // This is now an array of strings
  port: parseInt(process.env.PORT || '5000', 10),
  postgresConfig: {
    host: jsonConfig.POSTGRES_HOST || process.env.POSTGRES_HOST || '',
    port: parseInt(
      jsonConfig.POSTGRES_PORT || process.env.POSTGRES_PORT || '5432',
      10
    ),
    username: jsonConfig.POSTGRES_USER || process.env.POSTGRES_USER || '',
    password:
      jsonConfig.POSTGRES_PASSWORD || process.env.POSTGRES_PASSWORD || '',
    database: jsonConfig.POSTGRES_DB || process.env.POSTGRES_DB || '',
  },
  openWeatherMap: {
    apiKey:
      jsonConfig.OPEN_WEATHER_MAP_API_KEY ||
      process.env.OPEN_WEATHER_MAP_API_KEY ||
      '',
  },
  serialPortConfig: {
    baudRate: jsonConfig.BAUD_RATE || process.env.BAUD_RATE || '',
    comPort: jsonConfig.COM_PORT || process.env.COM_PORT || '',
  },
  kafkaConfig: {
    clientId:
      jsonConfig.KAFKA_CLIENT_ID || process.env.KAFKA_CLIENT_ID || 'my-app', // Default clientId
    brokers: jsonConfig.KAFKA_BROKERS?.split(',') ||
      process.env.KAFKA_BROKERS?.split(',') || [
        '192.168.0.115:9092',
        '<WAN-IP>:9094',
      ], // Use array from JSON or split comma-separated environment variable
  },
};

export default config as Config;
