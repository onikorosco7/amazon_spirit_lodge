import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { PromotionsService } from './promotions.service';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller('promotions')
export class PromotionsController {
  constructor(private readonly promoService: PromotionsService) {}

  @Get()
  findAll() {
    return this.promoService.findAll();
  }

  @Get('validar/:code')
  validar(@Param('code') code: string) {
    return this.promoService.validarCodigo(code);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Post()
  create(@Body() data: any) {
    return this.promoService.create(data);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.promoService.update(+id, data);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.promoService.delete(+id);
  }
}
