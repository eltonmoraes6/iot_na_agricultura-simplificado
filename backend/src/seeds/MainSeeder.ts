import { DataSource } from 'typeorm';
import { runSeeder, Seeder, SeederFactoryManager } from 'typeorm-extension';
import { SeasonSeeder } from './SeasonSeeder';
import { SoilSeeder } from './SoilSeeder';

export class MainSeeder implements Seeder {
  async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager
  ): Promise<void> {
    await runSeeder(dataSource, SoilSeeder);
    await runSeeder(dataSource, SeasonSeeder);
  }
}
