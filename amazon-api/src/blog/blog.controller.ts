import { Controller, Get, Post, Body, Delete, Param, UseGuards, Req } from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('blog')
export class BlogController {
    constructor(private readonly blogService: BlogService) { }

    @Get()
    findAll() {
        return this.blogService.findAll();
    }

    @UseGuards(AuthGuard('jwt'))
    @Post()
    create(@Body() dto: CreateBlogDto, @Req() req) {
        if (req.user.role !== 'admin') {
            throw new Error('No autorizado');
        }
        return this.blogService.create(dto);
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete(':id')
    remove(@Param('id') id: string, @Req() req) {
        if (req.user.role !== 'admin') {
            throw new Error('No autorizado');
        }
        return this.blogService.remove(+id);
    }
}
