import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './infra/schemas/user.schema';
import { UsersRepository } from './infra/repositories/users.repository';
import { LoggerService } from 'src/log/logger.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, LoggerService],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}
