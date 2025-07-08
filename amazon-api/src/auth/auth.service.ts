import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(data: RegisterDto) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await this.usersService.create({ ...data, password: hashedPassword });

    const payload = {
      sub: Number(user.id),  // Asegura que sea un número
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user,
    };
  }

  async login(data: LoginDto) {
    const user = await this.usersService.findOneByEmail(data.email);
    if (!user || !(await bcrypt.compare(data.password, user.password))) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = {
      sub: Number(user.id),
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user,
    };
  }

  async changePassword(userId: number, dto: ChangePasswordDto) {
    const user = await this.usersService.findOneById(userId);
    if (!user) throw new Error('Usuario no encontrado');

    const match = await bcrypt.compare(dto.currentPassword, user.password);
    if (!match) throw new Error('La contraseña actual es incorrecta');

    const hashed = await bcrypt.hash(dto.newPassword, 10);
    await this.usersService.update(userId, { password: hashed });

    return { message: 'Contraseña actualizada correctamente' };
  }
}
