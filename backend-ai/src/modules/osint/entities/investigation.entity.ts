import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { OsintExecution } from './osint-execution.entity';

export enum InvestigationStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export enum InvestigationDepth {
  SHALLOW = 'shallow',
  MEDIUM = 'medium',
  DEEP = 'deep',
}

@Entity('investigations')
export class Investigation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  username?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  phone?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  full_name?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  location?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  domain?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  ip_address?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  bitcoin_address?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  ethereum_address?: string;

  @Column({ type: 'text', nullable: true })
  image_url?: string;

  @Column({ type: 'text', nullable: true })
  custom_target?: string;

  @Column({
    type: 'enum',
    enum: InvestigationDepth,
    default: InvestigationDepth.MEDIUM,
  })
  depth: InvestigationDepth;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({
    type: 'enum',
    enum: InvestigationStatus,
    default: InvestigationStatus.PENDING,
  })
  status: InvestigationStatus;

  @Column({ type: 'jsonb', nullable: true })
  summary?: Record<string, any>;

  @Column({ type: 'text', nullable: true })
  report_url?: string;

  @OneToMany(() => OsintExecution, (execution) => execution.investigation)
  executions: OsintExecution[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}