import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.role) {
      console.warn('Usuario sin rol o no autenticado:', user);
      throw new ForbiddenException('Usuario no autenticado o sin rol');
    }

    const isAllowed = requiredRoles.includes(user.role);

    if (!isAllowed) {
      console.warn(`Acceso denegado: rol "${user.role}" no está en [${requiredRoles.join(', ')}]`);
      throw new ForbiddenException(`Acceso denegado para rol: ${user.role}`);
    }

    return true;
  }
}
