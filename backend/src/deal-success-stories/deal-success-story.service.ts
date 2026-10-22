import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DealSuccessStory } from './deal-success-story.entity';
import { User } from '../auth/entities/user.entity';
import { TradeDeal } from '../trade-deals/entities/trade-deal.entity';

@Injectable()
export class DealSuccessStoryService {
  constructor(
    @InjectRepository(DealSuccessStory)
    private readonly storyRepo: Repository<DealSuccessStory>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(TradeDeal)
    private readonly tradeDealRepo: Repository<TradeDeal>,
  ) {}

  async createStory(
    farmerId: string,
    dto: {
      title: string;
      description: string;
      tradeDealId: string;
      totalValue: number;
      totalInvested: number;
      commodity: string;
      impactScore: number;
    },
  ): Promise<DealSuccessStory> {
    const farmer = await this.userRepo.findOne({ where: { id: farmerId } });
    if (!farmer) {
      throw new NotFoundException('Farmer not found.');
    }

    const tradeDeal = await this.tradeDealRepo.findOne({
      where: { id: dto.tradeDealId },
    });
    if (!tradeDeal) {
      throw new NotFoundException('Trade deal not found.');
    }

    const story = this.storyRepo.create({
      title: dto.title,
      description: dto.description,
      farmerId,
      tradeDealId: dto.tradeDealId,
      totalValue: dto.totalValue,
      totalInvested: dto.totalInvested,
      commodity: dto.commodity,
      impactScore: dto.impactScore,
      isFeatured: false,
    });

    return await this.storyRepo.save(story);
  }

  async getStoriesByFarmer(farmerId: string): Promise<DealSuccessStory[]> {
    return this.storyRepo.find({
      where: { farmerId },
      order: { createdAt: 'DESC' },
    });
  }

  async getFeaturedStories(): Promise<DealSuccessStory[]> {
    return this.storyRepo.find({
      where: { isFeatured: true },
      order: { createdAt: 'DESC' },
    });
  }

  async featureStory(storyId: string): Promise<DealSuccessStory> {
    const story = await this.storyRepo.findOne({
      where: { id: storyId },
    });
    if (!story) {
      throw new NotFoundException('Deal success story not found.');
    }
    story.isFeatured = true;
    return await this.storyRepo.save(story);
  }
}