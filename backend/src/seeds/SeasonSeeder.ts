import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { Season } from '../entities/season.entity';
import { SeasonType } from '../entities/seasonType.enum';

export class SeasonSeeder implements Seeder {
  async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager
  ): Promise<void> {
    const seasonRepository = dataSource.getRepository(Season);

    const seasonData = [
      {
        season: SeasonType.SAMMER,
      },
      {
        season: SeasonType.FALL,
      },
      {
        season: SeasonType.WINTER,
      },
      {
        season: SeasonType.SPRING,
      },
    ];

    const newSoil = seasonRepository.create(seasonData);
    await seasonRepository.save(newSoil);
  }
}
