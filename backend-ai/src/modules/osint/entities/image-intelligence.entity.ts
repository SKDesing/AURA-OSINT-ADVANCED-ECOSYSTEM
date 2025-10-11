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

@Entity('image_intelligence')
@Index(['image_url'])
@Index(['image_hash'])
@Index(['execution_id'])
export class ImageIntelligence {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => OsintExecution, (execution) => execution.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'execution_id' })
  execution: OsintExecution;

  @Column({ type: 'uuid' })
  execution_id: string;

  @Column({ type: 'text' })
  image_url: string;

  @Column({ type: 'varchar', length: 64, nullable: true })
  image_hash: string; // MD5 or SHA256 hash

  @Column({ type: 'varchar', length: 50, nullable: true })
  image_format: string; // JPEG, PNG, GIF, etc.

  @Column({ type: 'integer', nullable: true })
  width: number;

  @Column({ type: 'integer', nullable: true })
  height: number;

  @Column({ type: 'integer', nullable: true })
  file_size: number; // in bytes

  @Column({ type: 'jsonb', nullable: true })
  exif_data: Record<string, any>; // EXIF metadata

  @Column({ type: 'jsonb', nullable: true })
  geolocation: Record<string, any>; // GPS coordinates from EXIF

  @Column({ type: 'jsonb', nullable: true })
  faces_detected: Record<string, any>; // Face detection results

  @Column({ type: 'integer', nullable: true })
  faces_count: number;

  @Column({ type: 'jsonb', nullable: true })
  face_encodings: Record<string, any>; // Face recognition encodings

  @Column({ type: 'jsonb', nullable: true })
  demographics: Record<string, any>; // Age, gender, emotion estimates

  @Column({ type: 'jsonb', nullable: true })
  reverse_search_results: Record<string, any>; // TinEye, Google Images results

  @Column({ type: 'text', array: true, nullable: true })
  similar_images: string[]; // URLs of similar images found

  @Column({ type: 'jsonb', nullable: true })
  object_detection: Record<string, any>; // Objects detected in image

  @Column({ type: 'jsonb', nullable: true })
  text_extraction: Record<string, any>; // OCR results

  @Column({ type: 'jsonb', nullable: true })
  color_analysis: Record<string, any>; // Dominant colors, palette

  @Column({ type: 'varchar', length: 50, nullable: true })
  camera_make: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  camera_model: string;

  @Column({ type: 'timestamptz', nullable: true })
  date_taken: Date; // From EXIF data

  @Column({ type: 'varchar', length: 100, nullable: true })
  software_used: string; // Photo editing software

  @Column({ type: 'boolean', default: false })
  is_manipulated: boolean; // Potential photo manipulation detected

  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true })
  manipulation_confidence: number;

  @Column({ type: 'varchar', length: 20, nullable: true })
  content_rating: string; // safe, questionable, explicit

  @Column({ type: 'text', array: true, nullable: true })
  tags: string[]; // Auto-generated or manual tags

  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true })
  confidence_score: number;

  @Column({ type: 'jsonb', nullable: true })
  raw_output: Record<string, any>;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}