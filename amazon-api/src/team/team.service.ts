import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from './entities/team.entity';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Team)
    private repo: Repository<Team>,
  ) {}

  create(dto: CreateTeamDto) {
    const team = this.repo.create(dto);
    return this.repo.save(team);
  }

  findAll() {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async update(id: number, dto: UpdateTeamDto) {
    const member = await this.repo.findOneBy({ id });
    if (!member) throw new NotFoundException('Miembro no encontrado');
    Object.assign(member, dto);
    return this.repo.save(member);
  }

  async remove(id: number) {
    const member = await this.repo.findOneBy({ id });
    if (!member) throw new NotFoundException('Miembro no encontrado');
    return this.repo.remove(member);
  }
}
