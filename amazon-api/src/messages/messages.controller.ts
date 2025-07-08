import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  Req,
  ForbiddenException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Request } from 'express';
import { User } from 'src/users/entities/user.entity';

@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) { }

  @Get('my-conversation')
  async getOrCreate(@Req() req: Request) {
    const user = req.user as User;
    if (!user) throw new UnauthorizedException();

    const conversation = await this.messagesService.getOrCreateConversation(user);

    // Seguridad: validar que la conversación devuelta sea del usuario
    if (!conversation.user || conversation.user.id !== user.id) {
      throw new ForbiddenException('No puedes acceder a esta conversación');
    }

    return conversation;
  }

  @Get(':id')
  async getMessages(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as User;
    if (!user) throw new UnauthorizedException();

    const isAdmin = user.role === 'admin';

    try {
      const result = await this.messagesService.getMessages(id, user, isAdmin);
      return Array.isArray(result) ? result : [];
    } catch (error) {
      console.error('❌ Error en getMessages:', error?.message || error);

      // Si es Forbidden o NotFound, devolvemos [] para evitar romper frontend
      if (
        error instanceof ForbiddenException ||
        error instanceof NotFoundException
      ) {
        return [];
      }

      // Si es otro error, relanzamos
      throw error;
    }
  }

  @Post(':id')
  async sendMessage(
    @Param('id') id: string,
    @Body() dto: CreateMessageDto,
    @Req() req: Request,
  ) {
    const user = req.user as User;
    if (!user) throw new UnauthorizedException();
    const isAdmin = user.role === 'admin';

    if (dto.sender === 'admin' && !isAdmin) {
      throw new ForbiddenException('Solo el administrador puede enviar como admin');
    }

    if (dto.sender === 'user' && isAdmin) {
      throw new ForbiddenException('El administrador no puede enviar como user');
    }

    return this.messagesService.createMessage(id, dto, user, isAdmin);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async getAllConversations() {
    return this.messagesService.getAllConversations();
  }
}
