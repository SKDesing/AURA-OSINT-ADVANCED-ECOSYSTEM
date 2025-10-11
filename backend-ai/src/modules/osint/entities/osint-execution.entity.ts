import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Investigation } from './investigation.entity';

export enum ExecutionStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  SUCCESS = 'success',
  FAILED = 'failed',
  SKIPPED = 'skipped',
}

@Entity('osint_executions')
export class OsintExecution {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Investigation, (investigation) => investigation.executions)
  @JoinColumn({ name: 'investigation_id' })
  investigation: Investigation;

  @Column({ type: 'uuid' })
  investigation_id: string;

  @Column({ type: 'varchar', length: 100 })
  tool_name: string;

  @Column({ type: 'varchar', length: 50 })
  tool_category: string;

  @Column({
    type: 'enum',
    enum: ExecutionStatus,
    default: ExecutionStatus.PENDING,
  })
  status: ExecutionStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  duration_seconds?: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  cpu_percent?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  memory_mb?: number;

  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true })
  confidence_score?: number;

  @Column({ type: 'jsonb', nullable: true })
  data?: Record<string, any>;

  @Column({ type: 'text', nullable: true })
  error_message?: string;

  @CreateDateColumn()
  created_at: Date;
}