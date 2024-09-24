// src/entities/soil.entity.ts
import { Column, Entity } from 'typeorm';
import Model from './model.entity';
import { SoilType } from './soilType.enum';

@Entity('soils')
export class Soil extends Model {
  @Column({ type: 'enum', enum: SoilType, default: SoilType.ARGISSOLO })
  soilType: string;
}
