import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlogEntry } from './entities/blog.entity';
import { CreateBlogDto } from './dto/create-blog.dto';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(BlogEntry)
    private blogRepo: Repository<BlogEntry>,
  ) {}

  create(dto: CreateBlogDto) {
    const post = this.blogRepo.create(dto);
    return this.blogRepo.save(post);
  }

  findAll() {
    return this.blogRepo.find({
      order: { createdAt: 'DESC' },
    });
  }

  async remove(id: number) {
    return this.blogRepo.delete(id);
  }
}
