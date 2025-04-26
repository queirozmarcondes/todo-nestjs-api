import { Module } from '@nestjs/common';
import { TasksService } from './services/tasks.service';
import { TasksController } from './controllers/tasks.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from './infra/schemas/tasks.schema';
import { TasksRepository } from './infra/repositories/tasks.repository';
import { LoggerService } from 'src/log/logger.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
  ],
  controllers: [TasksController],
  providers: [TasksService, TasksRepository, LoggerService],
})
export class TasksModule {}
