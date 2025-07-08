import {
  Controller, Get, Post, Delete, Param, UseInterceptors,
  UploadedFile, Body, UseGuards, Req
} from '@nestjs/common';
import { DownloadsService } from './downloads.service';
import { CreateDownloadDto } from './dto/create-download.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import { AuthGuard } from '@nestjs/passport';
import * as fs from 'fs';

@Controller('downloads')
export class DownloadsController {
  constructor(private readonly service: DownloadsService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: (req, file, cb) => {
        const folderPath = join(process.cwd(), 'public', 'pdfs');

        // ✅ Crea la carpeta si no existe
        if (!fs.existsSync(folderPath)) {
          fs.mkdirSync(folderPath, { recursive: true });
        }

        cb(null, folderPath);
      },
      filename: (_, file, cb) => {
        // ✅ Siempre usar el mismo nombre
        cb(null, 'rates.pdf');
      },
    }),
    fileFilter: (_, file, cb) => {
      if (file.mimetype === 'application/pdf') {
        cb(null, true);
      } else {
        cb(new Error('Only PDF files allowed'), false);
      }
    },
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB máximo
  }))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Req() req) {
    if (req.user.role !== 'admin') throw new Error('No autorizado');

    const dto: CreateDownloadDto = {
      filename: 'rates.pdf',
      url: '/pdfs/rates.pdf',
    };

    return this.service.create(dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('from-url')
  async createFromUrl(@Body() body: CreateDownloadDto, @Req() req) {
    if (req.user.role !== 'admin') throw new Error('No autorizado');

    // 🛠 Si es Google Drive, conviértelo a modo de vista directa
    let fixedUrl = body.url;
    if (fixedUrl.includes('drive.google.com')) {
      const idMatch = fixedUrl.match(/id=([^&]+)/);
      if (idMatch) {
        const id = idMatch[1];
        fixedUrl = `https://drive.google.com/uc?export=view&id=${id}`;
      }
    }

    const dto: CreateDownloadDto = {
      filename: 'rates.pdf',
      url: fixedUrl,
    };

    return this.service.create(dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req) {
    if (req.user.role !== 'admin') throw new Error('No autorizado');
    return this.service.remove(+id);
  }

  @Get('latest')
  findLatest() {
    return this.service.findLatest();
  }
}
