import { Injectable, Logger } from '@nestjs/common';
import { TradeDeal } from '../trade-deals/entities/trade-deal.entity';

const TRANSPORT_EMISSIONS_PER_TON_KM = 0.015; // kg CO2e per ton-km
const STORAGE_EMISSIONS_PER_DAY_PER_TON = 0.002; // kg CO2e per ton-day
const PROCESSING_EMISSIONS_PER_UNIT = 0.5; // kg CO2e per unit processed

@Injectable()
export class CarbonCalculatorService {
  private readonly logger = new Logger(CarbonCalculatorService.name);

  calculateTransportationCarbon(
    quantity: number,
    distanceKm: number,
    transportMode: 'ship' | 'train' | 'truck' | 'air',
  ): number {
    let efficiencyMultiplier: number;

    switch (transportMode) {
      case 'ship':
        efficiencyMultiplier = 1.0;
        break;
      case 'train':
        efficiencyMultiplier = 0.8;
        break;
      case 'truck':
        efficiencyMultiplier = 1.2;
        break;
      case 'air':
        efficiencyMultiplier = 3.5;
        break;
      default:
        efficiencyMultiplier = 1.0;
    }

    const baseEmissions = quantity * distanceKm * TRANSPORT_EMISSIONS_PER_TON_KM;
    const emissions = baseEmissions * efficiencyMultiplier;

    this.logger.log(
      `Transportation carbon: ${quantity} tons × ${distanceKm} km × ${efficiencyMultiplier} multiplier = ${emissions} kg CO2e`,
    );

    return Math.round(emissions * 100) / 100;
  }

  calculateStorageCarbon(
    quantity: number,
    storageDays: number,
    facilityType: 'cold_storage' | 'warehouse' | 'open_air',
  ): number {
    let efficiencyMultiplier: number;

    switch (facilityType) {
      case 'cold_storage':
        efficiencyMultiplier = 1.0;
        break;
      case 'warehouse':
        efficiencyMultiplier = 0.6;
        break;
      case 'open_air':
        efficiencyMultiplier = 0.3;
        break;
      default:
        efficiencyMultiplier = 1.0;
    }

    const baseEmissions = quantity * storageDays * STORAGE_EMISSIONS_PER_DAY_PER_TON;
    const emissions = baseEmissions * efficiencyMultiplier;

    this.logger.log(
      `Storage carbon: ${quantity} tons × ${storageDays} days × ${efficiencyMultiplier} multiplier = ${emissions} kg CO2e`,
    );

    return Math.round(emissions * 100) / 100;
  }

  calculateProcessingCarbon(
    quantity: number,
    processingType: 'minimal' | 'standard' | ' intensive',
  ): number {
    let efficiencyMultiplier: number;

    switch (processingType) {
      case 'minimal':
        efficiencyMultiplier = 0.5;
        break;
      case 'standard':
        efficiencyMultiplier = 1.0;
        break;
      case 'intensive':
        efficiencyMultiplier = 1.8;
        break;
      default:
        efficiencyMultiplier = 1.0;
    }

    const baseEmissions = quantity * PROCESSING_EMISSIONS_PER_UNIT;
    const emissions = baseEmissions * efficiencyMultiplier;

    this.logger.log(
      `Processing carbon: ${quantity} units × ${efficiencyMultiplier} multiplier = ${emissions} kg CO2e`,
    );

    return Math.round(emissions * 100) / 100;
  }

  async calculateTotalCarbonDeal(
    tradeDeal: TradeDeal,
  ): Promise<{
    transportation: number;
    storage: number;
    processing: number;
    total: number;
  }> {
    // Default values if not specified - these would typically come from
    // deal parameters, logistics data, or processing information
    const quantity = Number(tradeDeal.quantity) || 0;
    const totalValue = Number(tradeDeal.totalValue) || 0;

    // Transportation: estimate based on commodity and typical distances
    // In a real implementation, this would use actual logistics data
    let transportation = 0;
    let storage = 0;
    let processing = 0;

    // Example calculation based on commodity type
    const commodity = tradeDeal.commodity.toLowerCase();

    if (commodity.includes('cocoa')) {
      transportation = this.calculateTransportationCarbon(
        quantity,
        8000, // typical cocoa export distance km
        'ship',
      );
      storage = this.calculateStorageCarbon(quantity, 30, 'cold_storage');
      processing = this.calculateProcessingCarbon(quantity, 'standard');
    } else if (commodity.includes('coffee')) {
      transportation = this.calculateTransportationCarbon(
        quantity,
        7000,
        'ship',
      );
      storage = this.calculateStorageCarbon(quantity, 45, 'cold_storage');
      processing = this.calculateProcessingCarbon(quantity, 'standard');
    } else {
      // Generic calculation
      transportation = this.calculateTransportationCarbon(
        quantity,
        5000,
        'ship',
      );
      storage = this.calculateStorageCarbon(quantity, 20, 'warehouse');
      processing = this.calculateProcessingCarbon(quantity, 'standard');
    }

    const total = transportation + storage + processing;

    this.logger.log(
      `Total carbon footprint for ${tradeDeal.id}: ${total} kg CO2e (transport: ${transportation}, storage: ${storage}, processing: ${processing})`,
    );

    return { transportation, storage, processing, total };
  }

  async updateDealCarbonFootprint(tradeDealId: string): Promise<TradeDeal> {
    const tradeDeal = await this._getTradeDeal(tradeDealId);
    if (!tradeDeal) {
      throw new Error('Trade deal not found.');
    }

    const { transportation, storage, processing, total } = await this.calculateTotalCarbonDeal(
      tradeDeal,
    );

    tradeDeal.transportationCarbon = transportation;
    tradeDeal.storageCarbon = storage;
    tradeDeal.processingCarbon = processing;
    tradeDeal.carbonFootprint = total;

    return tradeDeal; // In a real implementation, would save to DB
  }

  private async _getTradeDeal(id: string): Promise<TradeDeal | null> {
    // This would use the repository - for now return null as placeholder
    return null;
  }
}