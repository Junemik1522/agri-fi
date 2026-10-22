import { Module } from '@nestjs/common';
import { CarbonCalculatorService } from './carbon-calculator.service';

@Module({
  providers: [CarbonCalculatorService],
  exports: [CarbonCalculatorService],
})
export class CarbonCalculatorModule {}