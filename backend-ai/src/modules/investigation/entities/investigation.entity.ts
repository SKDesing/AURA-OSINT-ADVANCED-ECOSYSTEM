import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { ToolResult } from './tool-result.entity';

@Entity('investigations')
export class Investigation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ default: 'active' })
  status: string;

  @Column({ type: 'jsonb', nullable: true })
  data: any;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => ToolResult, toolResult => toolResult.investigation)
  toolResults: ToolResult[];
}