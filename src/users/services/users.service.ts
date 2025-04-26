import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import * as bcrypt from 'bcryptjs';

import { UserDocument } from '../infra/schemas/user.schema';
import { UsersRepository } from '../infra/repositories/users.repository';
import { LoggerService } from 'src/log/logger.service';
import { UserResponseDto } from '../dto/response-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly logger: LoggerService,
  ) {}

  async create(
    createUserDto: CreateUserDto,
  ): Promise<Partial<UserResponseDto>> {
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

      const userObj = user.toObject<UserDocument>();
      const userResponse: UserResponseDto = {
        id: userObj._id.toString(),
        email: userObj.email,
        createdAt: userObj.createdAt,
        updatedAt: userObj.updatedAt,
      };
      return userResponse;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.stack : 'Unknown error';
      this.logger.error('Erro ao criar usuário', errorMessage as string);
      throw new InternalServerErrorException('Erro ao criar usuário');
    }
  }

  async findAll(): Promise<UserResponseDto[]> {
    this.logger.log('Buscando todos os usuários');

    const users = await this.usersRepository.findAll(); // Supondo que findAll retorne uma lista de usuários

    const userResponses: UserResponseDto[] = users.map((user) => {
      const userObj = user.toObject<UserDocument>();
      return {
        id: userObj._id.toString(),
        email: userObj.email,
        createdAt: userObj.createdAt,
        updatedAt: userObj.updatedAt,
      };
    });

    return userResponses;
  }

  async findOne(id: string): Promise<UserResponseDto | null> {
    this.logger.log(`Buscando usuário pelo id: ${id}`);
    const user = await this.usersRepository.findById(id);
    if (!user) {
      this.logger.warn(`Usuário com id ${id} não encontrado`);
      throw new NotFoundException('Usuário não encontrado');
    }

    const userObj = user.toObject<UserDocument>();
    const userResponse: UserResponseDto = {
      id: userObj._id.toString(),
      email: userObj.email,
      createdAt: userObj.createdAt,
      updatedAt: userObj.updatedAt,
    };
    return userResponse;
  }

  async findByEmail(email: string): Promise<UserResponseDto | null> {
    this.logger.log(`Buscando usuário pelo email: ${email}`);
    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      this.logger.warn(`Usuário com email ${email} não encontrado`);
      throw new NotFoundException('Usuário não encontrado');
    }

    const userObj = user.toObject<UserDocument>();
    const userResponse: UserResponseDto = {
      id: userObj._id.toString(),
      email: userObj.email,
      createdAt: userObj.createdAt,
      updatedAt: userObj.updatedAt,
    };
    return userResponse;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto | null> {
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

    if (!updatedUser) {
      this.logger.warn(`Falha ao atualizar usuário com id ${id}`);
      throw new InternalServerErrorException('Erro ao atualizar usuário');
    }
    const userObj = updatedUser.toObject<UserDocument>();
    const userResponse: UserResponseDto = {
      id: userObj._id.toString(),
      email: userObj.email,
      createdAt: userObj.createdAt,
      updatedAt: userObj.updatedAt,
    };
    return userResponse;
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
