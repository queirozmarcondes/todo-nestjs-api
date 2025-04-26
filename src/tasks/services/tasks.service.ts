import { Injectable, NotFoundException } from '@nestjs/common';
import { LoggerService } from 'src/log/logger.service';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { TasksRepository } from '../infra/repositories/tasks.repository';
import { TaskDocument } from '../infra/schemas/tasks.schema';

@Injectable()
export class TasksService {
  constructor(private readonly tasksRepository: TasksRepository,
              private readonly logger: LoggerService
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<TaskDocument> {
    this.logger.log(`Creating task with title: ${createTaskDto.title}`);
    return this.tasksRepository.create(createTaskDto);
  }

  async findAll(): Promise<TaskDocument[]> {
    this.logger.log('Fetching all tasks');
    return this.tasksRepository.findAll();
  }

  async findOne(id: string): Promise<TaskDocument> {
    this.logger.log(`Fetching task with ID: ${id}`);
    const task = await this.tasksRepository.findOne(id);
    if (!task) {
      this.logger.error('Task not found', id);
      throw new NotFoundException('Tarefa não encontrada');
    }
    return task;
  }

  async update(
    id: string,
    updateTaskDto: UpdateTaskDto,
  ): Promise<TaskDocument> {
    this.logger.log(`Updating task with ID: ${id}`);
    const task = await this.tasksRepository.update(id, updateTaskDto);
    if (!task) {
      this.logger.error('Task not found', id);
      throw new NotFoundException('Tarefa não encontrada');
    }
    return task;
  }

  async remove(id: string): Promise<void> {
    this.logger.log(`Removing task with ID: ${id}`);
    await this.tasksRepository.remove(id);
    this.logger.log(`Task with ID: ${id} removed`);
  }
}
