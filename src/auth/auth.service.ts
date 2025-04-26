import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/services/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './login.dto';
import { UserDocument } from 'src/users/infra/schemas/user.schema';
import * as bcrypt from 'bcryptjs';
import { JwtPayload } from './jwt.strategy';
import { LoggerService } from 'src/log/logger.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly logger: LoggerService,
  ) {}

  async login(loginDto: LoginDto): Promise<{ access_token: string }> {
    this.logger.log('Iniciando processo de login');
    this.logger.log(`Email: ${loginDto.email}`);
    const user = (await this.usersService.findByEmail(
      loginDto.email,
    )) as UserDocument;

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payload = this.createPayload(user);

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  private createPayload(user: UserDocument): JwtPayload {
    return {
      sub: user._id.toString(),
      email: user.email,
    };
  }
}
