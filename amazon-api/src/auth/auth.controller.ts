import { Body, Controller, Post, Put, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { ChangePasswordDto } from './dto/change-password.dto';


@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly jwtService: JwtService,
    ) { }

    @Post('register')
    register(@Body() data: RegisterDto) {
        return this.authService.register(data);
    }

    @Post('login')
    login(@Body() data: LoginDto) {
        return this.authService.login(data);
    }

    @Post('refresh')
    refresh(@Body('refresh_token') token: string) {
        try {
            const payload = this.jwtService.verify(token);
            const newAccessToken = this.jwtService.sign({
                sub: payload.sub,
                email: payload.email,
                role: payload.role,
            }, { expiresIn: '15m' });

            return { access_token: newAccessToken };
        } catch (error) {
            throw new UnauthorizedException('Refresh token inválido');
        }
    }
    @UseGuards(AuthGuard('jwt'))
    @Put('change-password')
    changePassword(@Req() req, @Body() dto: ChangePasswordDto) {
        const userId = req.user.sub || req.user.userId;
        return this.authService.changePassword(userId, dto);
    }
}
