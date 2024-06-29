import { Column, Entity } from 'typeorm';
import Model from './model.entity';

@Entity()
export class Weather extends Model {
  @Column('float')
  lat!: number;

  @Column('float')
  lon!: number;

  @Column('float')
  temp!: number;

  @Column()
  description!: string;

  @Column('float')
  humidity!: number;

  @Column('float')
  pressure!: number;

  @Column('float')
  wind_speed!: number;

  @Column()
  name!: string;

  @Column('float')
  feels_like!: number;

  @Column('timestamp')
  timestamp!: Date;
}
