import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import * as bcrypt from 'bcryptjs';

import { User, UserDocument } from '../infra/schemas/user.schema';
import { UsersRepository } from '../infra/repositories/users.repository';
import { LoggerService } from 'src/log/logger.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly logger: LoggerService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<Partial<UserDocument>> {
    try {
      this.logger.log('Iniciando criação de usuário');
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

      const userToCreate = {
        ...createUserDto,
        password: hashedPassword,
      };

      const user: UserDocument =
        await this.usersRepository.create(userToCreate);
      this.logger.log(`Usuário criado com sucesso: ${user.email}`);

      // Remover a senha antes de retornar o usuário
      const { password, ...userWithoutPassword } = user.toObject();

      return userWithoutPassword; // Retorna o usuário sem a senha
    } catch (error) {
      this.logger.error('Erro ao criar usuário', error.stack);
      throw new InternalServerErrorException('Erro ao criar usuário');
    }
  }

  async findAll(): Promise<UserDocument[]> {
    this.logger.log('Buscando todos os usuários');
    return this.usersRepository.findAll(); // Retorna uma lista de UserDocument
  }

  async findOne(id: string): Promise<UserDocument | null> {
    this.logger.log(`Buscando usuário pelo id: ${id}`);
    const user = await this.usersRepository.findById(id);
    if (!user) {
      this.logger.warn(`Usuário com id ${id} não encontrado`);
      throw new NotFoundException('Usuário não encontrado');
    }
    return user;
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    this.logger.log(`Buscando usuário pelo email: ${email}`);
    return this.usersRepository.findByEmail(email); // Retorna um UserDocument ou null
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument | null> {
    this.logger.log(`Atualizando usuário com id: ${id}`);

    const user = await this.usersRepository.findById(id);
    if (!user) {
      this.logger.warn(`Usuário com id ${id} não encontrado para atualização`);
      throw new NotFoundException('Usuário não encontrado');
    }

    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt();
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, salt);
    }

    const updatedUser = await this.usersRepository.update(id, updateUserDto);
    this.logger.log(`Usuário com id ${id} atualizado com sucesso`);
    return updatedUser; // Retorna um UserDocument
  }

  async remove(id: string): Promise<void> {
    this.logger.log(`Removendo usuário com id: ${id}`);

    const user = await this.usersRepository.findById(id);
    if (!user) {
      this.logger.warn(`Usuário com id ${id} não encontrado para remoção`);
      throw new NotFoundException('Usuário não encontrado');
    }

    await this.usersRepository.remove(id);
    this.logger.log(`Usuário com id ${id} removido com sucesso`);
  }
}
