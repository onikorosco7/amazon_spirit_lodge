import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    private usersService: UsersService,
  ) {}

  async create(data: { message: string; rating: number }, userId: number) {
    const user = await this.usersService.findOneById(userId);
    if (!user) throw new NotFoundException('Usuario no encontrado');

    const existe = await this.reviewRepository.findOne({
      where: { user: { id: userId } },
    });
    if (existe) {
      throw new BadRequestException('Ya enviaste una reseña.');
    }

    const review = this.reviewRepository.create({ ...data, user });
    return this.reviewRepository.save(review);
  }

  findAll() {
    return this.reviewRepository.find({
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  findMine(userId: number) {
    return this.reviewRepository.find({
      where: { user: { id: userId } },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number) {
    const review = await this.reviewRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!review) throw new NotFoundException('Reseña no encontrada');
    return review;
  }

  async remove(id: number) {
    return this.reviewRepository.delete(id);
  }
}
