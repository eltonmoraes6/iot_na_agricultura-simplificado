import { Column, Entity } from 'typeorm';

import Model from './model.entity';

@Entity('humidities')
export class Humidity extends Model {
  @Column({ type: 'decimal', precision: 5, scale: 2 })
  humidity: number;
}
