import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  Delete,
  Param,
  ForbiddenException,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  // ✅ Público: Ver todas las reseñas
  @Get()
  findAll() {
    return this.reviewsService.findAll();
  }

  // ✅ Cliente autenticado: Ver sus propias reseñas
  @UseGuards(AuthGuard('jwt'))
  @Get('mine')
  findMine(@Req() req) {
    return this.reviewsService.findMine(req.user.id);
  }

  // ✅ Cliente autenticado: Crear reseña
  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() body: { message: string; rating: number }, @Req() req) {
    return this.reviewsService.create(body, req.user.id);
  }

  // ✅ Cliente o Admin: Eliminar reseña propia o de otros (solo admin puede eliminar ajenas)
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req) {
    const review = await this.reviewsService.findOne(+id);
    if (!review) throw new Error('Reseña no encontrada');

    const isOwner = review.user.id === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException('No autorizado para eliminar esta reseña');
    }

    return this.reviewsService.remove(+id);
  }
}
