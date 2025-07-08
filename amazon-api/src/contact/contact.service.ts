import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ContactMessage } from './entities/contact.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(ContactMessage)
    private contactRepo: Repository<ContactMessage>,
    private usersService: UsersService
  ) {}

  create(data: Partial<ContactMessage>) {
    const message = this.contactRepo.create(data);
    return this.contactRepo.save(message);
  }

  async createFromUser(data: { message: string; phone?: string }, userId: number) {
    const user = await this.usersService.findOneById(userId);
    if (!user) throw new Error('Usuario no encontrado');

    const nuevo = this.contactRepo.create({
      name: user.fullName,
      email: user.email,
      phone: data.phone,
      message: data.message,
      user,
    });

    return this.contactRepo.save(nuevo);
  }

  findAll() {
    return this.contactRepo.find({ order: { createdAt: 'DESC' } });
  }

  async findMine(userId: number) {
    return this.contactRepo.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  remove(id: number) {
    return this.contactRepo.delete(id);
  }
}
