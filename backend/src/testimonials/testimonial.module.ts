import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Testimonial } from './entities/testimonial.entity';
import { TestimonialService } from './testimonial.service';
import { TestimonialController } from './testimonial.controller';
import { User } from '../auth/entities/user.entity';
import { TradeDeal } from '../trade-deals/entities/trade-deal.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Testimonial, User, TradeDeal])],
  providers: [TestimonialService],
  controllers: [TestimonialController],
  exports: [TestimonialService],
})
export class TestimonialModule {}