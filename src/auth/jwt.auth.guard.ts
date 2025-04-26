import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: Error | null, user: any, info: any) {
    if (err || !user) {
      throw new UnauthorizedException(
        info?.message || 'Token inválido ou expirado',
      );
    }
    return user;
  }
}
