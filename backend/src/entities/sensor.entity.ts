import { Column, Entity } from 'typeorm';

import Model from './model.entity';

@Entity('sensors')
export class Sensor extends Model {
  @Column({ type: 'decimal', precision: 5, scale: 2 })
  temperature: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  humidity: number;

  @Column()
  season: string;
}
