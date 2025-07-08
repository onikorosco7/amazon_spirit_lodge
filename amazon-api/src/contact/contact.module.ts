import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactService } from './contact.service';
import { ContactController } from './contact.controller';
import { ContactMessage } from './entities/contact.entity';
import { UsersModule } from 'src/users/users.module'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([ContactMessage]),
    UsersModule, 
  ],
  controllers: [ContactController],
  providers: [ContactService],
})
export class ContactModule {}
