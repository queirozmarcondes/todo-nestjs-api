import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly configService: ConfigService,
        private readonly usersService: UsersService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET', 'fallbackSecret'), // Forneça um fallback
            // Ou use secretOrKeyProvider para maior controle:
            /*
            secretOrKeyProvider: (
                request: Request,
                rawJwtToken: string,
                done: (err: any, secret: string) => void
            ) => {
                done(null, configService.get<string>('JWT_SECRET'));
            }
            */
        });
    }

    async validate(payload: { sub: string; email: string }) {
        const user = await this.usersService.findOne(payload.sub);

        if (!user) {
            throw new UnauthorizedException('Usuário não encontrado');
        }

        return {
            id: payload.sub,
            email: payload.email,
            // Inclua outras propriedades necessárias
        };
    }
}