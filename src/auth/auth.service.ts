import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UsersRepository } from '../users/infra/repositories/users.repository';
import { UserDocument } from '../users/infra/schemas/user.schema';
import { LoggerService } from 'src/log/logger.service';
import { JwtService } from '@nestjs/jwt';

// Defina o tipo para o Payload do JWT
interface JwtPayload {
  email: string;
  sub: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly logger: LoggerService,
    private readonly jwtService: JwtService,
  ) {}

  // Método para validar o usuário com email e senha
  async validateUser(
    email: string,
    password: string,
  ): Promise<UserDocument | null> {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      this.logger.warn(`Usuário com email ${email} não encontrado`);
      return null;
    }

    // Verificando se a senha está correta
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      this.logger.warn(`Senha incorreta para o usuário ${email}`);
      return null;
    }

    return user; // Retorna o usuário do tipo UserDocument
  }

  // Método para buscar o usuário pelo ID (para validação do JWT)
  async findUserById(userId: string): Promise<UserDocument | null> {
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      this.logger.warn(`Usuário com ID ${userId} não encontrado`);
      return null;
    }

    return user;
  }

  // Método de login, agora com um tipo bem definido para o retorno
  login(user: UserDocument): { access_token: string } {
    // Garante que o user passado aqui é do tipo UserDocument
    const payload: JwtPayload = this.createPayload(user); // Corrigido, não há necessidade de await

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  // A função createPayload agora retorna um objeto de tipo JwtPayload
  private createPayload(user: UserDocument): JwtPayload {
    return {
      email: user.email,
      sub: user._id.toString(), // Garantindo que sub seja do tipo string
    };
  }
}
