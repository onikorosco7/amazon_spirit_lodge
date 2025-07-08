import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { Room } from './entities/room.entity';

@Controller('rooms')
export class RoomsController {
    constructor( private readonly roomService: RoomsService) {}

    @Post()
    create(@Body() data: Partial<Room>) {
        return this.roomService.create(data);    
    }

    @Get()
    findAll(){
        return this.roomService.findALL();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.roomService.findOne(+id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() data: Partial<Room>) {
        return this.roomService.update(+id, data);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.roomService.remove(+id);
    }
}
