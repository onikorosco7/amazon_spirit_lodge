import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from './entities/image.entity';
import { CreateImageDto } from './dto/create-image.dto';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, extname } from 'path';

@Injectable()
export class GalleryService {
  constructor(
    @InjectRepository(Image)
    private imageRepo: Repository<Image>,
  ) {}

  async create(dto: CreateImageDto, file?: Express.Multer.File) {
    let imageUrl = dto.image?.trim();

    if (file && file.path) {
      const fileName = file.filename; // ← viene directo de multer
      imageUrl = `/galeria/${fileName}`; // acceso público desde main.ts
    }

    if (!imageUrl) {
      throw new BadRequestException('Debes subir una imagen o proporcionar una URL');
    }

    const image = this.imageRepo.create({
      title: dto.title,
      description: dto.description,
      category: dto.category,
      imageUrl,
    });

    return this.imageRepo.save(image);
  }

  findAll() {
    return this.imageRepo.find({ order: { createdAt: 'DESC' } });
  }

  async remove(id: number) {
    const image = await this.imageRepo.findOneBy({ id });
    if (!image) throw new NotFoundException('Imagen no encontrada');
    return this.imageRepo.remove(image);
  }
}
