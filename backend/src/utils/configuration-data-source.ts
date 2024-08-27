import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Configuration } from '../entities/configuration.entity';

// Initialize the ConfigDataSource
export const ConfigDataSource = new DataSource({
  type: 'sqlite',
  database: 'src/database.sqlite',
  entities: [Configuration],
  synchronize: true,
  logging: true,
});

async function initializeApp() {
  try {
    console.log('Initializing Configuration Data Source...');
    await ConfigDataSource.initialize();
    console.log('Configuration Data Source initialized');

    // Now that the data source is initialized, you can use your services
    // Example: const configService = new ConfigService();
  } catch (error) {
    console.error('Error initializing Configuration Data Source:', error);
    process.exit(1);
  }
}

initializeApp();
