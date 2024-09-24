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

    const soilData = [
      {
        soilType: SoilType.ARGISSOLO, // Replace with desired soil type
      },
      {
        soilType: SoilType.LATOSSOLO, // Replace with desired soil type
      },
      {
        soilType: SoilType.NEOSSOLO, // Replace with desired soil type
      },
    ];
    const newSoil = soilRepository.create(soilData);
    await soilRepository.save(newSoil);
  }
}
