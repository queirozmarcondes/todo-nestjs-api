import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  NotFoundException,
} from '@nestjs/common';
import { TasksService } from '../services/tasks.service';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { ApiTags } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { LoggerService } from 'src/log/logger.service';

@ApiTags('Tasks')
@Controller('tasks')
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
    private readonly logger: LoggerService,
  ) {}

  @Post()
  async create(@Body() createTaskDto: CreateTaskDto) {
    this.logger.log(`Received request to create a task`);
    const task = await this.tasksService.create(createTaskDto);
    return { message: 'Tarefa criada com sucesso', task };
  }

  @Get()
  async findAll() {
    this.logger.log(`Received request to fetch all tasks`);
    const tasks = await this.tasksService.findAll();
    return { message: 'Tarefas encontradas com sucesso', tasks };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    this.logger.log(`Received request to fetch task with ID: ${id}`);
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('ID inválido');
    }
    const task = await this.tasksService.findOne(id);
    return { message: 'Tarefa encontrada', task };
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    this.logger.log(`Received request to update task with ID: ${id}`);
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('ID inválido');
    }
    const updatedTask = await this.tasksService.update(id, updateTaskDto);
    return { message: 'Tarefa atualizada com sucesso', task: updatedTask };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    this.logger.log(`Received request to create a task`);
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('ID inválido');
    }
    await this.tasksService.remove(id);
    return { message: 'Tarefa deletada com sucesso' };
  }
}
