import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
//import * as bcrypt from 'bcrypt';
import * as bcrypt from 'bcryptjs';

import { User } from './infra/schemas/user.schema';
import { UsersRepository } from './infra/repositories/users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) { }

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

      const userToCreate = {
        ...createUserDto,
        password: hashedPassword,
      };

      return await this.usersRepository.create(userToCreate);
    } catch (error) {
      throw new Error('Error creating user: ' + error.message);
    }
  }


  async findAll(): Promise<User[]> {
    return this.usersRepository.findAll();  // Supondo que 'findAll' esteja implementado no repositório
  }

  async findOne(id: string): Promise<User | null> {
    return this.usersRepository.findById(id);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findByEmail(email);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User | null> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }

    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt();
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, salt);
    }

    return this.usersRepository.update(id, updateUserDto);
  }


  async remove(id: string): Promise<void> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }

    await this.usersRepository.remove(id);  // Supondo que você tenha esse método no repositório
  }

}
