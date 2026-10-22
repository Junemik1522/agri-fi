import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EcoCertification } from './eco-certification.entity';
import { EcoCertificationService } from './eco-certification.service';
import { EcoCertificationController } from './eco-certification.controller';

@Module({
  imports: [TypeOrmModule.forFeature([EcoCertification])],
  providers: [EcoCertificationService],
  controllers: [EcoCertificationController],
  exports: [EcoCertificationService],
})
export class EcoCertificationModule {}