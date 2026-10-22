import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { TestimonialService } from './testimonial.service';
import { Testimonial } from './entities/testimonial.entity';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';

@ApiTags('testimonials')
@ApiBearerAuth('jwt')
@UseGuards(AuthGuard('jwt'))
@Controller()
export class TestimonialController {
  constructor(private readonly testimonialService: TestimonialService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new testimonial' })
  async createTestimonial(
    @Request() req: { user: { id: string } },
    @Body() body: CreateTestimonialDto,
  ): Promise<Testimonial> {
    return this.testimonialService.createTestimonial(req.user.id, body);
  }

  @Get()
  @ApiOperation({ summary: 'Get all testimonials' })
  async getTestimonials(
    @Request() req: { user: { id: string } },
    @Query('dealId') dealId?: string,
  ) {
    if (dealId) {
      return this.testimonialService.getTestimonialsByDeal(dealId);
    }
    return this.testimonialService.getTestimonialsByUser(req.user.id);
  }

  @Get('featured')
  @ApiOperation({ summary: 'Get featured testimonials' })
  async getFeaturedTestimonials(): Promise<Testimonial[]> {
    return this.testimonialService.getFeaturedTestimonials();
  }

  @Get(':id/feature')
  @ApiOperation({ summary: 'Feature a testimonial (admin)' })
  async featureTestimonial(
    @Param('id') testimonialId: string,
  ): Promise<Testimonial> {
    return this.testimonialService.featureTestimonial(testimonialId);
  }
}