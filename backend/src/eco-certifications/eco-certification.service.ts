import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EcoCertification } from './eco-certification.entity';

@Injectable()
export class EcoCertificationService {
  constructor(
    @InjectRepository(EcoCertification)
    private readonly certRepo: Repository<EcoCertification>,
  ) {}

  async findAll(): Promise<EcoCertification[]> {
    return this.certRepo.find({ where: { isActive: true } });
  }

  async findOneByName(name: string): Promise<EcoCertification | null> {
    return this.certRepo.findOne({ where: { name } });
  }

  async create(name: string, description: string, standard: string): Promise<EcoCertification> {
    const existing = await this.certRepo.findOne({ where: { name } });
    if (existing) {
      throw new Error('Eco certification already exists.');
    }

    const cert = this.certRepo.create({
      name,
      description,
      standard,
      isActive: true,
    });

    return await this.certRepo.save(cert);
  }

  async toggleStatus(id: string): Promise<EcoCertification> {
    const cert = await this.certRepo.findOne({ where: { id } });
    if (!cert) {
      throw new NotFoundException('Eco certification not found.');
    }
    cert.isActive = !cert.isActive;
    return await this.certRepo.save(cert);
  }
}