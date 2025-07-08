import { Controller, Get, Post, Body, Delete, Param } from '@nestjs/common';
import { HeroService } from './hero.service';
import { CreateHeroDto } from './dto/create-hero.dto';

@Controller('hero')
export class HeroController {
  constructor(private readonly heroService: HeroService) {}

  @Get()
  findAll() {
    return this.heroService.findAll();
  }

  @Post()
  create(@Body() dto: CreateHeroDto) {
    return this.heroService.create(dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.heroService.remove(+id);
  }
}