import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module'; // Importa o módulo de usuários
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './jwt.auth.guard';

@Module({
  imports: [
    UsersModule, // O módulo de usuários é necessário para o serviço de autenticação
    PassportModule.register({ defaultStrategy: 'jwt' }), // Configura a estratégia de autenticação
    JwtModule.registerAsync({
      imports: [ConfigModule], // Depende do módulo de configuração
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), // A chave secreta do JWT
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN', '1h'), // Tempo de expiração do token
        },
      }),
      inject: [ConfigService], // Injeta o ConfigService para acessar variáveis de ambiente
    }),
  ],
  providers: [
    AuthService, // Serviço de autenticação
    JwtStrategy, // Estratégia JWT para validação de tokens
    JwtAuthGuard, // Guard de autenticação baseado em JWT
  ],
  controllers: [AuthController], // Controlador de autenticação
  exports: [JwtAuthGuard, JwtModule, AuthService], // Exports para uso em outros módulos
})
export class AuthModule {}
