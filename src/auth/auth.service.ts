import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './login.dto';
import { UserDocument } from 'src/users/infra/schemas/user.schema';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async login(loginDto: LoginDto) {
        const user = await this.usersService.findByEmail(loginDto.email) as UserDocument;

        if (!user) {
            throw new UnauthorizedException('Usuário não encontrado');
        }

        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Senha incorreta');
        }

        const payload = {
            email: user.email,
            sub: user._id,
        };

        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}