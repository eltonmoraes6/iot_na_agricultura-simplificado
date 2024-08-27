import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Configuration {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  key!: string;

  @Column()
  value!: string;
}
