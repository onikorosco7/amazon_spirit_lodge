import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'amazon@2025',
    });
  }

  async validate(payload: any) {
    return {
      id: Number(payload.sub), // 👈 debe ser 'id'
      email: payload.email,
      role: payload.role,
    };
  }
}
