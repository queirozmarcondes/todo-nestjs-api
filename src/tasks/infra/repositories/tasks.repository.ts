import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, TaskDocument } from '../schemas/tasks.schema';
import { NotFoundException } from '@nestjs/common';
import { ITasksRepository } from './tasks.repository.interface copy';

@Injectable()
export class TasksRepository implements ITasksRepository {
    constructor(
        @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
    ) { }

    async create(createTaskDto: any): Promise<Task> {
        const created = new this.taskModel(createTaskDto);
        return created.save();
    }

    async findAll(): Promise<Task[]> {
        return this.taskModel.find().exec();
    }

    async findOne(id: string): Promise<Task> {
        const task = await this.taskModel.findById(id).exec();
        if (!task) throw new NotFoundException('Task not found');
        return task;
    }

    async update(id: string, updateTaskDto: any): Promise<Task> {
        const task = await this.taskModel.findByIdAndUpdate(id, updateTaskDto, { new: true });
        if (!task) throw new NotFoundException('Task not found');
        return task;
    }

    async remove(id: string): Promise<void> {
        const res = await this.taskModel.findByIdAndDelete(id);
        if (!res) throw new NotFoundException('Task not found');
    }
}
