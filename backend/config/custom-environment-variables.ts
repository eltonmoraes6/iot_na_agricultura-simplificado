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
  redisConfig: {
    host: string;
    port: number;
  };
  openWeatherMap: {
    apiKey: string;
  };
  serialPortConfig: {
    baudRate: string;
    comPort: string;
  };
  accessTokenPrivateKey: string;
  accessTokenPublicKey: string;
  refreshTokenPrivateKey: string;
  refreshTokenPublicKey: string;
  smtp: {
    host: string;
    pass: string;
    port: number;
    user: string;
  };
  cors: { origin: string[] }; // Change from [string] to string[]
}

// Load JSON configuration
const jsonConfigPath = path.join(__dirname, '../src/config/config.json');
const jsonConfig = JSON.parse(fs.readFileSync(jsonConfigPath, 'utf8'));
console.log('jsonConfig ======> ', jsonConfig);

const config: Config = {
  cors: { origin: ['http://localhost:3000'] }, // This is now an array of strings
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
  redisConfig: {
    host: process.env.REDIS_HOST || '',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
  },
  openWeatherMap: {
    apiKey: process.env.OPEN_WEATHER_MAP_API_KEY || '',
  },
  serialPortConfig: {
    baudRate: process.env.BAUD_RATE || '',
    comPort: process.env.COM_PORT || '',
  },
  accessTokenPrivateKey: process.env.JWT_ACCESS_TOKEN_PRIVATE_KEY || '',
  accessTokenPublicKey: process.env.JWT_ACCESS_TOKEN_PUBLIC_KEY || '',
  refreshTokenPrivateKey: process.env.JWT_REFRESH_TOKEN_PRIVATE_KEY || '',
  refreshTokenPublicKey: process.env.JWT_REFRESH_TOKEN_PUBLIC_KEY || '',
  smtp: {
    host: process.env.EMAIL_HOST || '',
    pass: process.env.EMAIL_PASS || '',
    port: parseInt(process.env.EMAIL_PORT || '587', 10),
    user: process.env.EMAIL_USER || '',
  },
};

export default config as Config;
