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

@ApiTags('Tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  async create(@Body() createTaskDto: CreateTaskDto) {
    const task = await this.tasksService.create(createTaskDto);
    return { message: 'Tarefa criada com sucesso', task };
  }

  @Get()
  async findAll() {
    const tasks = await this.tasksService.findAll();
    return { message: 'Tarefas encontradas com sucesso', tasks };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('ID inválido');
    }
    const task = await this.tasksService.findOne(id);
    return { message: 'Tarefa encontrada', task };
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('ID inválido');
    }
    const updatedTask = await this.tasksService.update(id, updateTaskDto);
    return { message: 'Tarefa atualizada com sucesso', task: updatedTask };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('ID inválido');
    }
    await this.tasksService.remove(id);
    return { message: 'Tarefa deletada com sucesso' };
  }
}
