import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { Request } from 'express';
import { UpdateMeDto } from './dto/update-me.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  // ✅ Ruta pública (solo se usa en registro interno si aplica)
  @Post()
  create(@Body() data: Partial<User>) {
    return this.usersService.create(data);
  }

  // ✅ Solo admin puede ver a todos los usuarios
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  // ✅ Solo admin puede ver un usuario específico
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOneById(+id);
  }

  // ✅ Solo admin puede actualizar a otros usuarios
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Put(':id')
  update(@Param('id') id: string, @Body() data: Partial<User>) {
    return this.usersService.update(+id, data);
  }

  // ✅ Solo admin puede eliminar usuarios
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  // ✅ Ruta protegida: ver su propio perfil
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getProfile(@Req() req: Request & { user?: any }) {
    const userId = this.getUserId(req);
    return this.usersService.findOneById(userId);
  }

  // ✅ Ruta protegida: editar su perfil
  @UseGuards(AuthGuard('jwt'))
  @Put('me')
  updateMe(@Req() req: Request & { user?: any }, @Body() data: UpdateMeDto) {
    const userId = this.getUserId(req);
    return this.usersService.updateMe(userId, data);
  }

  // ✅ Ruta protegida: cambiar avatar
  @UseGuards(AuthGuard('jwt'))
  @Put('avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  async updateAvatar(
    @Req() req: Request & { user?: any },
    @UploadedFile() file: Express.Multer.File
  ) {
    const userId = this.getUserId(req);
    const url = await this.cloudinaryService.uploadImage(file.buffer);
    return this.usersService.updateAvatar(userId, url);
  }

  // 🔐 Validación del ID del usuario logueado
  private getUserId(req: Request & { user?: any }): number {
    const userId = Number(req.user?.id); // ⚠️ DEBE ser 'id' según jwt.strategy.ts
    if (isNaN(userId)) {
      console.error('ID de usuario inválido en JWT:', req.user);
      throw new BadRequestException('ID de usuario inválido');
    }
    return userId;
  }
}
