import { CreateUserDto } from '../../dto/create-user.dto';
import { User } from '../schemas/user.schema';

export interface IUsersRepository {
  create(data: CreateUserDto): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  findAll(): Promise<User[]>; // Método para buscar todos os usuários
  update(id: string, data: Partial<CreateUserDto>): Promise<User | null>; // Método para atualizar um usuário
  remove(id: string): Promise<void>; // Método para remover um usuário
}
