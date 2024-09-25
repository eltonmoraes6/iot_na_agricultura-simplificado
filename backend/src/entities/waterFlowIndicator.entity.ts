import { Column, CreateDateColumn, Entity, UpdateDateColumn } from 'typeorm';
import Model from './model.entity';

@Entity('water_flow_indicators')
export class WaterFlowIndicator extends Model {
  @Column('float')
  waterFlowRate: number;

  @Column('float')
  totalWaterUsed: number;

  @Column('boolean', { default: false })
  isIrrigated: boolean;

  @Column({ type: 'timestamp', nullable: true })
  startIrrigationTime: Date;

  @Column({ type: 'timestamp', nullable: true })
  stopIrrigationTime: Date;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
