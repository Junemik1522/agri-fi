import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DealSuccessStory } from './deal-success-story.entity';
import { DealSuccessStoryService } from './deal-success-story.service';
import { DealSuccessStoryController } from './deal-success-story.controller';
import { User } from '../auth/entities/user.entity';
import { TradeDeal } from '../trade-deals/entities/trade-deal.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([DealSuccessStory, User, TradeDeal]),
  ],
  providers: [DealSuccessStoryService],
  controllers: [DealSuccessStoryController],
  exports: [DealSuccessStoryService],
})
export class DealSuccessStoryModule {}