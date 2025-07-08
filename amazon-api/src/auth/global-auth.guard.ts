import {
  Injectable,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';

@Injectable()
export class GlobalAuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  private isPublicRoute(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;

    const publicRoutes = [
      { method: 'POST', path: '/auth/login' },
      { method: 'POST', path: '/auth/register' },
      { method: 'GET', path: '/downloads/latest' },
      { method: 'GET', path: '/gallery' },
      { method: 'GET', path: '/hero' },
      { method: 'GET', path: '/blog' },
      { method: 'GET', path: '/blog/' },
      { method: 'GET', path: '/team' },
      { method: 'GET', path: '/contact' },
      { method: 'POST', path: '/contact' },
      { method: 'GET', path: '/terms' },
      { method: 'GET', path: '/privacy' },
      { method: 'GET', path: '/rooms' },
      { method: 'GET', path: '/reviews' },
    ];

    return publicRoutes.some(
      (route) =>
        method === route.method &&
        (url === route.path || url.startsWith(route.path)),
    );
  }

  canActivate(context: ExecutionContext): any {
    if (this.isPublicRoute(context)) {
      return true;
    }

    const guard = new (AuthGuard('jwt'))();
    return guard.canActivate(context);
  }
}
