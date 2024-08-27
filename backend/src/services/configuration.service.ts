import { Configuration } from '../entities/configuration.entity';
import { ConfigDataSource } from '../utils/configuration-data-source';

export class ConfigService {
  private configRepository = ConfigDataSource.getRepository(Configuration);

  constructor() {
    // Ensure the DataSource is initialized
    if (!ConfigDataSource.isInitialized) {
      throw new Error('DataSource is not initialized');
    }
    this.configRepository = ConfigDataSource.getRepository(Configuration);
  }

  async get(key: string): Promise<string | null> {
    try {
      const config = await this.configRepository.findOne({ where: { key } });
      return config ? config.value : null;
    } catch (error) {
      console.error('Error fetching configuration:', error);
      throw new Error('Could not fetch configuration');
    }
  }

  async set(key: string, value: string): Promise<void> {
    try {
      let config = await this.configRepository.findOne({ where: { key } });
      if (config) {
        config.value = value;
      } else {
        config = this.configRepository.create({ key, value });
      }
      await this.configRepository.save(config);
    } catch (error) {
      console.error('Error setting configuration:', error);
      throw new Error('Could not set configuration');
    }
  }

  async getAll(): Promise<Configuration[]> {
    try {
      return await this.configRepository.find();
    } catch (error) {
      console.error('Error fetching all configurations:', error);
      throw new Error('Could not fetch configurations');
    }
  }
}
