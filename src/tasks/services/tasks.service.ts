import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { TasksRepository } from '../infra/repositories/tasks.repository';
import { TaskDocument } from '../infra/schemas/tasks.schema';

@Injectable()
export class TasksService {
  constructor(private readonly tasksRepository: TasksRepository) {}

  async create(createTaskDto: CreateTaskDto): Promise<TaskDocument> {
    return this.tasksRepository.create(createTaskDto);
  }

  async findAll(): Promise<TaskDocument[]> {
    return this.tasksRepository.findAll();
  }

  async findOne(id: string): Promise<TaskDocument> {
    return this.tasksRepository.findOne(id);
  }

  async update(
    id: string,
    updateTaskDto: UpdateTaskDto,
  ): Promise<TaskDocument> {
    return this.tasksRepository.update(id, updateTaskDto);
  }

  async remove(id: string): Promise<void> {
    await this.tasksRepository.remove(id);
  }
}
