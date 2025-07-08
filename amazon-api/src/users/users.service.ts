import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateMeDto } from './dto/update-me.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  create(data: Partial<User>) {
    const user = this.userRepository.create(data);
    return this.userRepository.save(user);
  }

  findAll() {
    return this.userRepository.find({ relations: ['bookings'] });
  }

  findOneById(id: number) {
    return this.userRepository.findOne({ where: { id }, relations: ['bookings'] });
  }

  findOneByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  update(id: number, data: Partial<User>) {
    return this.userRepository.update(id, data);
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }

  // Actualizar perfil del usuario autenticado con validación de email
  async updateMe(userId: number, data: UpdateMeDto) {
    try {
      if (data.email) {
        const existing = await this.userRepository.findOne({
          where: { email: data.email },
        });

        if (existing && existing.id !== userId) {
          throw new BadRequestException('El correo ya está en uso por otro usuario.');
        }
      }

      await this.userRepository.update(userId, data);
      return this.findOneById(userId);
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('No se pudo actualizar el perfil.');
    }
  }

  async updateAvatar(userId: number, avatarUrl: string) {
    await this.userRepository.update(userId, { avatar: avatarUrl });
    return this.findOneById(userId);
  }
}
