import { Column, Entity, ManyToOne } from 'typeorm';

import Model from './model.entity';
import { Soil } from './soil.entity';

@Entity('sensors')
export class Sensor extends Model {
  @Column({ type: 'decimal', precision: 5, scale: 2 })
  temperature: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  humidity: number;

  @Column()
  season: string;

  @ManyToOne(() => Soil, (soil) => soil.sensor, {
    onDelete: 'SET NULL',
  })
  soil: Soil;
}
