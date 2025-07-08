import {
  Controller, Get, Post, Body, Param, Delete, UseGuards, Patch, Req, ForbiddenException
} from '@nestjs/common';
import { TeamService } from './team.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get()
  findAll() {
    return this.teamService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() dto: CreateTeamDto, @Req() req) {
    if (req.user.role !== 'admin') throw new ForbiddenException('No autorizado');
    return this.teamService.create(dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTeamDto, @Req() req) {
    if (req.user.role !== 'admin') throw new ForbiddenException('No autorizado');
    return this.teamService.update(+id, dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    if (req.user.role !== 'admin') throw new ForbiddenException('No autorizado');
    return this.teamService.remove(+id);
  }
}
