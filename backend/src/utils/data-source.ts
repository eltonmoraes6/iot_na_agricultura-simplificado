// import config from 'config';
import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';

import config from '../../config/custom-environment-variables';
import { MainSeeder } from '../seeds/MainSeeder';

const postgresConfig = config.postgresConfig; // TypeScript should infer the correct type here

const options: DataSourceOptions & SeederOptions = {
  ...postgresConfig,
  type: 'postgres',
  synchronize: false,
  logging: false,
  entities: ['src/entities/**/*.entity{.ts,.js}'],
  migrations: ['src/migrations/**/*{.ts,.js}'],
  subscribers: ['src/subscribers/**/*{.ts,.js}'],
  seeds: [MainSeeder],
};

export const AppDataSource = new DataSource(options);

export async function initializeMainDataSource() {
  try {
    await AppDataSource.initialize();
    console.log('Main Data Source initialized');
  } catch (error) {
    console.log('Error during Main Data Source initialization:', error);
  }
}
