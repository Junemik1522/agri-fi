import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { TradeDeal } from '../trade-deals/entities/trade-deal.entity';

@Entity('deal_success_stories')
export class DealSuccessStory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  farmerId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'farmer_id' })
  farmer: User;

  @ManyToOne(() => TradeDeal, { nullable: true })
  @JoinColumn({ name: 'deal_id' })
  tradeDeal: TradeDeal | null;

  @Column({ type: 'decimal', precision: 36, scale: 2 })
  totalValue: number;

  @Column({ type: 'decimal', precision: 36, scale: 2 })
  totalInvested: number;

  @Column()
  commodity: string;

  @Column({ type: 'integer' })
  impactScore: number; // 1-10 scale for environmental/social impact

  @Column({ type: 'boolean', default: false })
  isFeatured: boolean;

  @Column({ name: 'created_at', type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}