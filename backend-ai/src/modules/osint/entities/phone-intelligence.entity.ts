import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { OsintExecution } from './osint-execution.entity';

@Entity('phone_intelligence')
@Index(['phone_number'])
@Index(['country_code'])
@Index(['carrier'])
@Index(['execution_id'])
export class PhoneIntelligence {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => OsintExecution, (execution) => execution.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'execution_id' })
  execution: OsintExecution;

  @Column({ type: 'uuid' })
  execution_id: string;

  @Column({ type: 'varchar', length: 50 })
  phone_number: string;

  @Column({ type: 'varchar', length: 50 })
  formatted_number: string;

  @Column({ type: 'varchar', length: 2, nullable: true })
  country_code: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  country_name: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  carrier: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  line_type: string; // mobile, landline, voip, etc.

  @Column({ type: 'boolean', default: false })
  is_valid: boolean;

  @Column({ type: 'boolean', default: false })
  is_possible: boolean;

  @Column({ type: 'varchar', length: 100, nullable: true })
  region: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  timezone: string;

  @Column({ type: 'jsonb', nullable: true })
  location_data: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  osint_data: Record<string, any>; // Additional OSINT findings

  @Column({ type: 'text', array: true, nullable: true })
  associated_services: string[]; // Services where this number is registered

  @Column({ type: 'varchar', length: 20, nullable: true })
  risk_level: string; // low, medium, high, critical

  @Column({ type: 'integer', nullable: true })
  spam_score: number; // 0-100

  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true })
  confidence_score: number;

  @Column({ type: 'jsonb', nullable: true })
  raw_output: Record<string, any>;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}