import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { EcoCertificationService } from './eco-certification.service';
import { EcoCertification } from './eco-certification.entity';
import { CreateEcoCertificationDto } from './dto/create-eco-certification.dto';

@ApiTags('eco-certifications')
@ApiBearerAuth('jwt')
@UseGuards(AuthGuard('jwt'))
@Controller()
export class EcoCertificationController {
  constructor(private readonly certService: EcoCertificationService) {}

  @Get()
  @ApiOperation({ summary: 'Get all eco certifications' })
  async getCertifications(): Promise<EcoCertification[]> {
    return this.certService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Create an eco certification (admin)' })
  async createCertification(
    @Body() body: CreateEcoCertificationDto,
  ): Promise<EcoCertification> {
    return this.certService.create(body.name, body.description, body.standard);
  }

  @Get('by-standard/:standard')
  @ApiOperation({ summary: 'Get certification by standard' })
  async getByStandard(
    @Param('standard') standard: string,
  ): Promise<EcoCertification | null> {
    return this.certService.findOneByName(standard);
  }
}