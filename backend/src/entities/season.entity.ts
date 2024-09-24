import { Column, Entity } from 'typeorm';

import Model from './model.entity';
import { SeasonType } from './seasonType.enum';

@Entity('seasons')
export class Season extends Model {
  @Column({ type: 'enum', enum: SeasonType })
  season: string;
}
