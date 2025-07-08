import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  // ✅ Crear una reserva (cliente autenticado)
  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(
    @Body() body: { roomId: number; checkIn: string; checkOut: string; guests: number },
    @Req() req
  ) {
    return this.bookingsService.create(body, req.user.id);
  }

  // ✅ Ver mis reservas (cliente autenticado)
  @UseGuards(AuthGuard('jwt'))
  @Get('mine')
  findMine(@Req() req) {
    return this.bookingsService.findMine(req.user.id);
  }

  // ✅ Obtener mis reservas (cliente autenticado)
  @UseGuards(AuthGuard('jwt'))
  @Get('mis-reservas')
  getMyBookings(@Req() req) {
    return this.bookingsService.findByUser(req.user.id);
  }

  // ✅ Ver disponibilidad de habitación
  @Get('disponibilidad/:roomId')
  async getDisponibilidad(@Param('roomId') roomId: number) {
    const fechas = await this.bookingsService.getFechasOcupadas(+roomId);
    return Array.isArray(fechas) ? fechas : [];
  }

  // ✅ Actualizar una reserva propia
  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  update(@Param('id') id: string, @Body() data: Partial<any>, @Req() req) {
    return this.bookingsService.updateByUser(+id, data, req.user.id);
  }

  // ✅ Cancelar una reserva propia
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  cancel(@Param('id') id: string, @Req() req) {
    return this.bookingsService.cancelBooking(+id, req.user.id);
  }

  // ✅ Admin: ver todas las reservas
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Get()
  findAll() {
    return this.bookingsService.findAll();
  }

  // ✅ Admin: actualizar cualquier reserva (ahora sí usa updateByAdmin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Put('admin/:id')
  updateByAdmin(@Param('id') id: string, @Body() data: Partial<any>) {
    return this.bookingsService.updateByAdmin(+id, data);
  }

  // ✅ Admin: eliminar cualquier reserva
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Delete('admin/:id')
  deleteByAdmin(@Param('id') id: string) {
    return this.bookingsService.delete(+id);
  }
}
