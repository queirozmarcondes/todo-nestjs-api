import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser = any>(
    err: any,
    user: TUser,
    info: { message?: string },
  ): TUser {
    if (err || !user) {
      throw new UnauthorizedException(
        info?.message || 'Token inválido ou expirado',
      );
    }
    return user;
  }
}
