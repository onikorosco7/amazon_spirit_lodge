import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogEntry } from './entities/blog.entity';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';

@Module({
    imports: [TypeOrmModule.forFeature([BlogEntry])],
    controllers: [BlogController],
    providers: [BlogService],
})
export class BlogModule { }
