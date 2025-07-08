import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { Room } from 'src/rooms/entities/room.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Booking, Room]), UsersModule],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}
