// src/entities/soil.entity.ts
import { Column, Entity } from 'typeorm';
import Model from './model.entity';
import { SeasonType } from './seasonType.enum';
import { SoilType } from './soilType.enum';

@Entity('metrics')
export class Metric extends Model {
  @Column({ type: 'decimal', precision: 5, scale: 2 })
  minHumidity: number; // Ponto de Murcha Permanente => PMP => Limite mínimo de umidade do solo para as plantas

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  maxHumidity: number; // Capacidade de Campo => CC => Limite máximo de umidade do solo para as plantas

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  minTemperature: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  maxTemperature: number;

  @Column({ type: 'enum', enum: SeasonType })
  season: string;

  @Column({ type: 'enum', enum: SoilType })
  soilType: string;
}
