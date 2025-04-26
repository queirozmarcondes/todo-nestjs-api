import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { CreateUserDto } from '../../dto/create-user.dto';
import { IUsersRepository } from './users.repository.interface';

@Injectable()
export class UsersRepository implements IUsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  // Criação de um novo usuário
  async create(data: CreateUserDto): Promise<User> {
    const user = new this.userModel(data);
    return user.save();
  }

  // Encontrar usuário por e-mail
  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  // Encontrar usuário por ID
  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }

  // Buscar todos os usuários
  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  // Atualizar um usuário
  async update(id: string, data: Partial<CreateUserDto>): Promise<User | null> {
    return this.userModel.findByIdAndUpdate(id, data, { new: true }).exec(); // 'new: true' retorna o documento atualizado
  }

  // Remover um usuário
  async remove(id: string): Promise<void> {
    await this.userModel.findByIdAndDelete(id).exec();
  }
}
