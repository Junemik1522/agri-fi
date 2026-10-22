import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Testimonial } from './entities/testimonial.entity';
import { User } from '../auth/entities/user.entity';
import { TradeDeal } from '../trade-deals/entities/trade-deal.entity';

@Injectable()
export class TestimonialService {
  constructor(
    @InjectRepository(Testimonial)
    private readonly testimonialRepo: Repository<Testimonial>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(TradeDeal)
    private readonly tradeDealRepo: Repository<TradeDeal>,
  ) {}

  async createTestimonial(
    userId: string,
    dto: { tradeDealId?: string; rating: number; comment: string },
  ): Promise<Testimonial> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const testimonial = this.testimonialRepo.create({
      userId,
      tradeDealId: dto.tradeDealId,
      rating: dto.rating,
      comment: dto.comment,
      isFeatured: false,
    });

    return await this.testimonialRepo.save(testimonial);
  }

  async getTestimonialsByDeal(dealId: string): Promise<Testimonial[]> {
    return this.testimonialRepo.find({
      where: { tradeDealId: dealId },
      order: { createdAt: 'DESC' },
    });
  }

  async getTestimonialsByUser(userId: string): Promise<Testimonial[]> {
    return this.testimonialRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async getFeaturedTestimonials(): Promise<Testimonial[]> {
    return this.testimonialRepo.find({
      where: { isFeatured: true },
      order: { createdAt: 'DESC' },
    });
  }

  async featureTestimonial(testimonialId: string): Promise<Testimonial> {
    const testimonial = await this.testimonialRepo.findOne({
      where: { id: testimonialId },
    });
    if (!testimonial) {
      throw new NotFoundException('Testimonial not found.');
    }
    testimonial.isFeatured = true;
    return await this.testimonialRepo.save(testimonial);
  }
}