import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Privacy } from './entities/privacy.entity';
import { UpdatePrivacyDto } from './dto/update-privacy.dto';

@Injectable()
export class PrivacyService {
    constructor(
        @InjectRepository(Privacy)
        private repo: Repository<Privacy>,
    ) { }

    async get(): Promise<Privacy> {
        const record = await this.repo.findOne({ where: {} });
        if (!record) throw new NotFoundException('No hay política de privacidad registrada');
        return record;
    }

    async update(dto: UpdatePrivacyDto) {
        let existing = await this.repo.findOne({ where: {} });

        if (!existing) {
            existing = this.repo.create(dto);
        } else {
            existing.content = dto.content;
        }

        return this.repo.save(existing);
    }
}
