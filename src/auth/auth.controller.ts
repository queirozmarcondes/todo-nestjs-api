import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './login.dto';
import { LoggerService } from 'src/log/logger.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService,
              private readonly logger: LoggerService,
              
  ) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    this.logger.log('Requisição de login recebida');
    try {
      const result = await this.authService.login(loginDto);
      return result;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException('Credenciais inválidas');
      }
      throw new UnauthorizedException('Erro ao tentar autenticar');
    }
  }
}
