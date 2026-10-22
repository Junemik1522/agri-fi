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

export type TestimonialRating = '5_stars' | '4_stars' | '3_stars' | '2_stars' | '1_star';

@Entity('testimonials')
export class Testimonial {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => TradeDeal, { nullable: true })
  @JoinColumn({ name: 'deal_id' })
  tradeDeal: TradeDeal | null;

  @Column()
  rating: number;

  @Column({ type: 'text' })
  comment: string;

  @Column({ type: 'boolean', default: false })
  isFeatured: boolean;

  @Column({ name: 'created_at', type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}