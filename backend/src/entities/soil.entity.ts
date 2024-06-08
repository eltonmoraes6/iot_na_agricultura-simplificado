// src/entities/soil.entity.ts
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import Model from './model.entity';
import { Sensor } from './sensor.entity';
import { SoilType } from './soilType.enum';

@Entity('soils')
export class Soil extends Model {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'enum', enum: SoilType, default: SoilType.ARGISSOLO })
  soilType: string;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  minHumidity: number; // Ponto de Murcha Permanente => PMP => Limite mínimo de umidade do solo para as plantas

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  maxHumidity: number; // Capacidade de Campo => CC => Limite máximo de umidade do solo para as plantas

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  minTemperature: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  maxTemperature: number;

  @OneToMany(() => Sensor, (sensor) => sensor.soil)
  sensor: Sensor[];
}
