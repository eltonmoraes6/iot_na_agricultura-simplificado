import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { Soil } from '../entities/soil.entity';
import { SoilType } from '../entities/soilType.enum';

export class SoilSeeder implements Seeder {
  async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager
  ): Promise<void> {
    const soilRepository = dataSource.getRepository(Soil);

    const userData = [
      {
        soilType: SoilType.ARGISSOLO, // Replace with desired soil type
        minHumidity: 10.5,
        maxHumidity: 25.0,
        minTemperature: 15.0,
        maxTemperature: 30.0,
      },
      {
        soilType: SoilType.LATOSSOLO, // Replace with desired soil type
        minHumidity: 10.5,
        maxHumidity: 25.0,
        minTemperature: 15.0,
        maxTemperature: 30.0,
      },
      {
        soilType: SoilType.NEOSSOLO, // Replace with desired soil type
        minHumidity: 10.5,
        maxHumidity: 25.0,
        minTemperature: 15.0,
        maxTemperature: 30.0,
      },
    ];
    const newUser = soilRepository.create(userData);
    await soilRepository.save(newUser);
  }
}
