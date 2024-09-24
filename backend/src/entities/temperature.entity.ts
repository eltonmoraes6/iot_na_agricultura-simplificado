import { Column, Entity } from 'typeorm';

import Model from './model.entity';

@Entity('temperatures')
export class Temperature extends Model {
  @Column({ type: 'decimal', precision: 5, scale: 2 })
  temperature: number;
}
