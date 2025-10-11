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

@Entity('domain_intelligence')
@Index(['domain'])
@Index(['registrar'])
@Index(['creation_date'])
@Index(['expiration_date'])
@Index(['execution_id'])
export class DomainIntelligence {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => OsintExecution, (execution) => execution.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'execution_id' })
  execution: OsintExecution;

  @Column({ type: 'uuid' })
  execution_id: string;

  @Column({ type: 'varchar', length: 255 })
  domain: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  registrar: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  registrar_iana_id: string;

  @Column({ type: 'date', nullable: true })
  creation_date: Date;

  @Column({ type: 'date', nullable: true })
  expiration_date: Date;

  @Column({ type: 'date', nullable: true })
  updated_date: Date;

  @Column({ type: 'varchar', length: 50, nullable: true })
  status: string; // active, expired, suspended, etc.

  @Column({ type: 'text', array: true, nullable: true })
  name_servers: string[];

  @Column({ type: 'jsonb', nullable: true })
  dns_records: Record<string, any>; // A, AAAA, MX, TXT, CNAME, NS records

  @Column({ type: 'jsonb', nullable: true })
  whois_data: Record<string, any>; // Complete WHOIS response

  @Column({ type: 'jsonb', nullable: true })
  registrant_info: Record<string, any>; // Registrant contact info (if public)

  @Column({ type: 'jsonb', nullable: true })
  admin_contact: Record<string, any>; // Admin contact info (if public)

  @Column({ type: 'jsonb', nullable: true })
  tech_contact: Record<string, any>; // Technical contact info (if public)

  @Column({ type: 'jsonb', nullable: true })
  historical_data: Record<string, any>; // Historical DNS/WHOIS changes

  @Column({ type: 'text', array: true, nullable: true })
  subdomains: string[]; // Discovered subdomains

  @Column({ type: 'text', array: true, nullable: true })
  related_domains: string[]; // Domains with same registrant/nameservers

  @Column({ type: 'jsonb', nullable: true })
  ssl_certificates: Record<string, any>; // SSL certificate info

  @Column({ type: 'varchar', length: 20, nullable: true })
  risk_level: string; // low, medium, high, critical

  @Column({ type: 'text', array: true, nullable: true })
  risk_factors: string[]; // Factors contributing to risk score

  @Column({ type: 'boolean', default: false })
  is_parked: boolean;

  @Column({ type: 'boolean', default: false })
  is_expired: boolean;

  @Column({ type: 'boolean', default: false })
  privacy_protected: boolean;

  @Column({ type: 'integer', nullable: true })
  domain_age_days: number;

  @Column({ type: 'integer', nullable: true })
  days_until_expiry: number;

  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true })
  confidence_score: number;

  @Column({ type: 'jsonb', nullable: true })
  raw_output: Record<string, any>;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}