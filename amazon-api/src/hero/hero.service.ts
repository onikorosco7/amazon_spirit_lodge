import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hero } from './entities/hero.entity';
import { CreateHeroDto } from './dto/create-hero.dto';

@Injectable()
export class HeroService {
  constructor(
    @InjectRepository(Hero)
    private heroRepo: Repository<Hero>
  ) {}

  findAll() {
    return this.heroRepo.find({ order: { createdAt: 'DESC' } });
  }

  create(dto: CreateHeroDto) {
    const item = this.heroRepo.create(dto);
    return this.heroRepo.save(item);
  }

  async remove(id: number) {
    const hero = await this.heroRepo.findOne({ where: { id } });
    if (!hero) throw new NotFoundException('Imagen no encontrada');
    return this.heroRepo.remove(hero);
  }
}
