import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoomsService {
    constructor(
        @InjectRepository(Room)
        private roomRepository: Repository<Room>,
    ){}
    create(data: Partial<Room>) {
        const room = this.roomRepository.create(data);
        return this.roomRepository.save(room);
    }
    findALL(){
        return this.roomRepository.find();
    }

    findOne(id: number) {
        return this.roomRepository.findOne({ where: { id } });
    }

    update(id: number, data: Partial<Room>) {
        return this.roomRepository.update(id, data);
    }

    remove(id: number) {
        return this.roomRepository.delete(id);
    }
}
