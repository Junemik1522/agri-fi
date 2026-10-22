import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { DealSuccessStoryService } from './deal-success-story.service';
import { DealSuccessStory } from './deal-success-story.entity';
import { CreateDealSuccessStoryDto } from './dto/create-deal-success-story.dto';

@ApiTags('deal-success-stories')
@ApiBearerAuth('jwt')
@UseGuards(AuthGuard('jwt'))
@Controller()
export class DealSuccessStoryController {
  constructor(
    private readonly storyService: DealSuccessStoryService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a deal success story' })
  async createStory(
    @Request() req: { user: { id: string } },
    @Body() body: CreateDealSuccessStoryDto,
  ): Promise<DealSuccessStory> {
    return this.storyService.createStory(req.user.id, body);
  }

  @Get()
  @ApiOperation({ summary: 'Get all deal success stories' })
  async getStories(): Promise<DealSuccessStory[]> {
    return this.storyService.getFeaturedStories();
  }

  @Get('by-farmer/:farmerId')
  @ApiOperation({ summary: 'Get stories by farmer' })
  async getStoriesByFarmer(
    @Param('farmerId') farmerId: string,
  ): Promise<DealSuccessStory[]> {
    return this.storyService.getStoriesByFarmer(farmerId);
  }

  @Get('featured')
  @ApiOperation({ summary: 'Get featured deal success stories' })
  async getFeaturedStories(): Promise<DealSuccessStory[]> {
    return this.storyService.getFeaturedStories();
  }

  @Post(':id/feature')
  @ApiOperation({ summary: 'Feature a deal success story (admin)' })
  async featureStory(
    @Param('id') storyId: string,
  ): Promise<DealSuccessStory> {
    return this.storyService.featureStory(storyId);
  }
}