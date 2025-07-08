import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Download } from './entities/download.entity';
import { CreateDownloadDto } from './dto/create-download.dto';

@Injectable()
export class DownloadsService {
  constructor(
    @InjectRepository(Download)
    private readonly downloadRepo: Repository<Download>,
  ) { }

  findAll() {
    return this.downloadRepo.find({ order: { createdAt: 'DESC' } });
  }

  create(dto: CreateDownloadDto) {
    const nuevo = this.downloadRepo.create(dto);
    return this.downloadRepo.save(nuevo);
  }

  async remove(id: number) {
    const doc = await this.downloadRepo.findOne({ where: { id } });
    if (!doc) throw new NotFoundException('Documento no encontrado');
    return this.downloadRepo.remove(doc);
  }

  async findLatest() {
    const list = await this.downloadRepo.find({
      order: { createdAt: 'DESC' },
      take: 1,
    });
    return list[0] || { url: null, message: 'No PDF found' };
  }
}
