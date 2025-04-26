import { CreateTaskDto } from '../../dto/create-task.dto';
import { UpdateTaskDto } from '../../dto/update-task.dto';
import { TaskDocument } from '../schemas/tasks.schema';

export interface ITasksRepository {
  create(createTaskDto: CreateTaskDto): Promise<TaskDocument>;
  findAll(): Promise<TaskDocument[]>;
  findOne(id: string): Promise<TaskDocument>;
  update(id: string, updateTaskDto: UpdateTaskDto): Promise<TaskDocument>;
  remove(id: string): Promise<void>;
}
