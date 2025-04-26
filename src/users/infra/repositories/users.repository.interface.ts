import { CreateUserDto } from '../../dto/create-user.dto';
import { User } from '../schemas/user.schema';

export interface IUsersRepository {
  create(data: CreateUserDto): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  update(id: string, data: Partial<CreateUserDto>): Promise<User | null>;
  remove(id: string): Promise<void>;
}
