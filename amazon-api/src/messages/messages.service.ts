import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation } from './entities/conversation.entity';
import { Message } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepo: Repository<Conversation>,

    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) { }

  // 1. Obtener o crear conversación para un usuario logeado
  async getOrCreateConversation(user: User): Promise<Conversation> {
    // ✅ Buscar la conversación del usuario actual
    let conversation = await this.conversationRepo.findOne({
      where: { user: { id: user.id } },
      relations: ['user'],
    });

    // ✅ Si no tiene conversación, crearla
    if (!conversation) {
      const userEntity = await this.userRepo.findOne({ where: { id: user.id } });
      if (!userEntity) throw new NotFoundException('Usuario no encontrado');

      conversation = this.conversationRepo.create({ user: userEntity });
      await this.conversationRepo.save(conversation);
    }

    // 👇 NUNCA lanza Forbidden, siempre se asegura que la conversación devuelta sea del usuario
    return conversation;
  }


  // 2. Obtener todos los mensajes de una conversación
  async getMessages(
    conversationId: string,
    user: User,
    isAdmin = false,
  ): Promise<Message[]> {
    const conversation = await this.conversationRepo.findOne({
      where: { id: conversationId },
      relations: ['user'],
    });

    if (!conversation) {
      throw new NotFoundException('Conversación no encontrada');
    }

    if (!conversation.user) {
      throw new ForbiddenException('Conversación sin usuario asignado');
    }

    if (!isAdmin && conversation.user.id !== user.id) {
      throw new ForbiddenException('No tienes acceso a esta conversación');
    }

    const msgs = await this.messageRepo.find({
      where: { conversation: { id: conversationId } },
      order: { createdAt: 'ASC' },
    });

    return Array.isArray(msgs) ? msgs : [];
  }

  // 3. Enviar mensaje
  async createMessage(
    conversationId: string,
    dto: CreateMessageDto,
    user: User,
    isAdmin = false,
  ): Promise<Message> {
    const conversation = await this.conversationRepo.findOne({
      where: { id: conversationId },
      relations: ['user'],
    });

    if (!conversation) throw new NotFoundException('Conversación no encontrada');

    if (!conversation.user) {
      throw new ForbiddenException('Conversación sin usuario asignado');
    }

    if (!isAdmin && conversation.user.id !== user.id) {
      throw new ForbiddenException('No puedes enviar mensajes en esta conversación');
    }

    const message = this.messageRepo.create({
      content: dto.content,
      sender: dto.sender,
      conversation,
    });

    const saved = await this.messageRepo.save(message);

    console.log('Mensaje guardado:', saved);
    return saved;
  }

  // 4. Listar todas las conversaciones
  async getAllConversations(): Promise<Conversation[]> {
    return this.conversationRepo.find({
      relations: ['user', 'messages'],
      order: { updatedAt: 'DESC' },
    });
  }
}
