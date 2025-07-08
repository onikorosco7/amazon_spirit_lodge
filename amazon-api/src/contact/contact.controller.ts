import {
  Controller,
  Post,
  Get,
  Body,
  Delete,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ContactService } from './contact.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  // 🟢 Ruta pública
  @Post()
  create(@Body() data: { name: string; email: string; phone?: string; message: string }) {
    return this.contactService.create(data);
  }

  // 🔐 Ruta protegida para enviar mensaje como usuario autenticado
  @UseGuards(AuthGuard('jwt'))
  @Post('autenticado')
  createAuthenticated(
    @Body() data: { message: string; phone?: string },
    @Req() req,
  ) {
    return this.contactService.createFromUser(data, req.user.userId);
  }

  // 🔐 Ruta protegida para ver mis mensajes
  @UseGuards(AuthGuard('jwt'))
  @Get('mine')
  findMine(@Req() req) {
    return this.contactService.findMine(req.user.userId);
  }

  // 🟢 Ruta pública para admin (o se protege si lo deseas)
  @Get()
  findAll() {
    return this.contactService.findAll();
  }

  // 🟢 Ruta pública o protegida según preferencia
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contactService.remove(+id);
  }
}
