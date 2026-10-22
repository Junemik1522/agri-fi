import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('eco_certifications')
export class EcoCertification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', length: 64 })
  standard: string; // e.g., 'USDA-Organic', 'Rainforest-Alliance', 'Fair-Trade'

  @Column({ type: 'boolean', default: false })
  isActive: boolean;

  @Column({ name: 'created_at', type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}