import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { LessThan, MoreThan, Not, Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { Room } from 'src/rooms/entities/room.entity';
import { InjectRepository as InjectRoomRepo } from '@nestjs/typeorm';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepo: Repository<Booking>,
    @InjectRoomRepo(Room)
    private roomRepo: Repository<Room>,
    private usersService: UsersService,
  ) {}

  async create(data: { roomId: number; checkIn: string; checkOut: string; guests: number }, userId: number) {
    const user = await this.usersService.findOneById(userId);
    if (!user) throw new BadRequestException('Usuario no encontrado');

    const room = await this.roomRepo.findOne({ where: { id: data.roomId } });
    if (!room) throw new BadRequestException('Habitación no encontrada');

    if (new Date(data.checkIn) >= new Date(data.checkOut)) {
      throw new BadRequestException('La fecha de salida debe ser posterior a la de entrada.');
    }

    const reservaExistente = await this.bookingRepo.findOne({
      where: {
        room: { id: data.roomId },
        status: Not('cancelled'),
        checkIn: LessThan(data.checkOut),
        checkOut: MoreThan(data.checkIn),
      },
    });

    if (reservaExistente) {
      throw new BadRequestException('La habitación ya está reservada en ese rango de fechas. Por favor elige otro rango fecha.');
    }

    const booking = this.bookingRepo.create({
      ...data,
      user,
      room,
      status: 'pending',
    });

    return this.bookingRepo.save(booking);
  }

  findAll() {
    return this.bookingRepo.find({ relations: ['user', 'room'], order: { createdAt: 'DESC' } });
  }

  findMine(userId: number) {
    return this.bookingRepo.find({
      where: { user: { id: userId } },
      relations: ['room'],
      order: { createdAt: 'DESC' },
    });
  }

  async getFechasOcupadas(roomId: number) {
    const reservas = await this.bookingRepo.find({
      where: { room: { id: roomId }, status: Not('cancelled') },
    });

    return reservas.map(r => ({
      checkIn: r.checkIn,
      checkOut: r.checkOut,
    }));
  }

  async findByUser(userId: number) {
    return this.bookingRepo.find({
      where: { user: { id: userId } },
      relations: ['room'],
      order: { checkIn: 'DESC' },
    });
  }

  update(id: number, data: Partial<Booking>) {
    return this.bookingRepo.update(id, data);
  }

  async updateByUser(id: number, data: Partial<Booking>, userId: number) {
    const booking = await this.bookingRepo.findOne({
      where: { id },
      relations: ['user', 'room'],
    });

    if (!booking) throw new BadRequestException('Reserva no encontrada');
    if (booking.user.id !== userId) throw new BadRequestException('No autorizado');

    if (data.checkIn && data.checkOut && new Date(data.checkIn) >= new Date(data.checkOut)) {
      throw new BadRequestException('La fecha de salida debe ser posterior a la de entrada.');
    }

    if (data.checkIn && data.checkOut) {
      const solapada = await this.bookingRepo.findOne({
        where: {
          room: { id: booking.room.id },
          status: Not('cancelled'),
          id: Not(id),
          checkIn: LessThan(data.checkOut),
          checkOut: MoreThan(data.checkIn),
        },
      });

      if (solapada) {
        throw new BadRequestException('Las fechas seleccionadas ya están ocupadas.');
      }
    }

    return this.bookingRepo.update(id, data);
  }

  async updateByAdmin(id: number, data: Partial<Booking>) {
    const booking = await this.bookingRepo.findOne({
      where: { id },
      relations: ['room'],
    });

    if (!booking) throw new BadRequestException('Reserva no encontrada');

    if (data.checkIn && data.checkOut && new Date(data.checkIn) >= new Date(data.checkOut)) {
      throw new BadRequestException('La fecha de salida debe ser posterior a la de entrada.');
    }

    if (data.checkIn && data.checkOut) {
      const solapada = await this.bookingRepo.findOne({
        where: {
          room: { id: booking.room.id },
          status: Not('cancelled'),
          id: Not(id),
          checkIn: LessThan(data.checkOut),
          checkOut: MoreThan(data.checkIn),
        },
      });

      if (solapada) {
        throw new BadRequestException('Las fechas seleccionadas se cruzan con otra reserva.');
      }
    }

    return this.bookingRepo.update(id, data);
  }

  async cancelBooking(id: number, userId: number) {
    const booking = await this.bookingRepo.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!booking) throw new Error('Reserva no encontrada');
    if (booking.user.id !== userId) throw new Error('No autorizado para cancelar esta reserva');

    return this.bookingRepo.update(id, { status: 'cancelled' });
  }

  delete(id: number) {
    return this.bookingRepo.delete(id);
  }
}
