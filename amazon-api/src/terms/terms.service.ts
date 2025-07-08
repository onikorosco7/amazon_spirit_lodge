import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Terms } from './entities/terms.entity';
import { UpdateTermsDto } from './dto/update-terms.dto';

@Injectable()
export class TermsService {
  constructor(
    @InjectRepository(Terms)
    private repo: Repository<Terms>,
  ) {}

  async get(): Promise<Terms> {
    const record = await this.repo.findOne({ where: {} }); // ✅
    if (!record) throw new NotFoundException('No hay términos registrados');
    return record;
  }

  async update(dto: UpdateTermsDto) {
    let existing = await this.repo.findOne({ where: {} }); // ✅
    if (!existing) {
      existing = this.repo.create(dto);
    } else {
      existing.content = dto.content;
    }
    return this.repo.save(existing);
  }
}
