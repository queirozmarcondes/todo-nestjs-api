import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksRepository } from './repositories/tasks.repository';

@Injectable()
export class TasksService {
  constructor(
    private readonly tasksRepository: TasksRepository, // Injeção do repositório
  ) { }

  async create(createTaskDto: CreateTaskDto) {
    return this.tasksRepository.create(createTaskDto);
  }

  async findAll() {
    return this.tasksRepository.findAll();
  }

  async findOne(id: string) {
    return this.tasksRepository.findOne(id);
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    return this.tasksRepository.update(id, updateTaskDto);
  }

  async remove(id: string) {
    return this.tasksRepository.remove(id);
  }
}
