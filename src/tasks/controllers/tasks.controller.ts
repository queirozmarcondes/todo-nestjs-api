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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
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
  @ApiOperation({ summary: 'Cria uma nova tarefa' })
  @ApiResponse({ status: 201, description: 'Tarefa criada com sucesso.' })
  @ApiBody({ type: CreateTaskDto })
  async create(@Body() createTaskDto: CreateTaskDto) {
    this.logger.log(`Received request to create a task`);
    const task = await this.tasksService.create(createTaskDto);
    return { message: 'Tarefa criada com sucesso', task };
  }

  @Get()
  @ApiOperation({ summary: 'Lista todas as tarefas' })
  @ApiResponse({
    status: 200,
    description: 'Lista de tarefas retornada com sucesso.',
  })
  async findAll() {
    this.logger.log(`Received request to fetch all tasks`);
    const tasks = await this.tasksService.findAll();
    return { message: 'Tarefas encontradas com sucesso', tasks };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca uma tarefa pelo ID' })
  @ApiParam({ name: 'id', description: 'ID da tarefa (ObjectId do MongoDB)' })
  @ApiResponse({ status: 200, description: 'Tarefa encontrada.' })
  @ApiResponse({
    status: 404,
    description: 'Tarefa não encontrada ou ID inválido.',
  })
  async findOne(@Param('id') id: string) {
    this.logger.log(`Received request to fetch task with ID: ${id}`);
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('ID inválido');
    }
    const task = await this.tasksService.findOne(id);
    return { message: 'Tarefa encontrada', task };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualiza uma tarefa pelo ID' })
  @ApiParam({ name: 'id', description: 'ID da tarefa (ObjectId do MongoDB)' })
  @ApiResponse({ status: 200, description: 'Tarefa atualizada com sucesso.' })
  @ApiResponse({
    status: 404,
    description: 'Tarefa não encontrada ou ID inválido.',
  })
  @ApiBody({ type: UpdateTaskDto })
  async update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    this.logger.log(`Received request to update task with ID: ${id}`);
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('ID inválido');
    }
    const updatedTask = await this.tasksService.update(id, updateTaskDto);
    return { message: 'Tarefa atualizada com sucesso', task: updatedTask };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove uma tarefa pelo ID' })
  @ApiParam({ name: 'id', description: 'ID da tarefa (ObjectId do MongoDB)' })
  @ApiResponse({ status: 200, description: 'Tarefa deletada com sucesso.' })
  @ApiResponse({
    status: 404,
    description: 'Tarefa não encontrada ou ID inválido.',
  })
  async remove(@Param('id') id: string) {
    this.logger.log(`Received request to delete a task`);
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('ID inválido');
    }
    await this.tasksService.remove(id);
    return { message: 'Tarefa deletada com sucesso' };
  }
}
