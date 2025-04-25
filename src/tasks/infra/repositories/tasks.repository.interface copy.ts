import { Task } from "../schemas/tasks.schema";

export interface ITasksRepository {
    create(createTaskDto: any): Promise<Task>;
    findAll(): Promise<Task[]>;
    findOne(id: string): Promise<Task>;
    update(id: string, updateTaskDto: any): Promise<Task>;
    remove(id: string): Promise<void>;
}
