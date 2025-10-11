import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Investigation } from './investigation.entity';

@Entity('tool_results')
export class ToolResult {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  investigationId: number;

  @Column()
  toolName: string;

  @Column('jsonb')
  result: any;

  @CreateDateColumn()
  executedAt: Date;

  @ManyToOne(() => Investigation, investigation => investigation.toolResults)
  @JoinColumn({ name: 'investigationId' })
  investigation: Investigation;
}