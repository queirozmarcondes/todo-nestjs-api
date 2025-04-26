import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, TaskDocument } from '../schemas/tasks.schema';
import { ITasksRepository } from './tasks.repository.interface';
import { CreateTaskDto } from '../../dto/create-task.dto';
import { UpdateTaskDto } from '../../dto/update-task.dto';

@Injectable()
export class TasksRepository implements ITasksRepository {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

  async create(createTaskDto: CreateTaskDto): Promise<TaskDocument> {
    const created = new this.taskModel(createTaskDto);
    return created.save();
  }

  async findAll(): Promise<TaskDocument[]> {
    return this.taskModel.find().exec();
  }

  async findOne(id: string): Promise<TaskDocument> {
    const task = await this.taskModel.findById(id).exec();
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<TaskDocument> {
    const task = await this.taskModel.findByIdAndUpdate(id, updateTaskDto, { new: true }).exec();
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async remove(id: string): Promise<void> {
    const task = await this.taskModel.findByIdAndDelete(id).exec();
    if (!task) throw new NotFoundException('Task not found');
  }
}
