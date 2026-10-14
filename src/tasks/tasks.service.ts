import { Injectable, NotFoundException } from '@nestjs/common';
import { TasksRepository } from './tasks.repository.js';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';
import { QueryTasksDto } from './dto/query-tasks.dto.js';
import { Task } from './entities/task.entity.js';

@Injectable()
export class TasksService {
  constructor(private readonly repo: TasksRepository) {}

  create(dto: CreateTaskDto): Promise<Task> {
    return this.repo.insert(dto);
  }

  async findAll(query: QueryTasksDto) {
    const { rows, total } = await this.repo.findMany(query);
    return {
      data: rows,
      meta: {
        total,
        page: query.page,
        limit: query.limit,
        totalPages: Math.ceil(total / query.limit),
      },
    };
  }

  async findOne(id: number): Promise<Task> {
    const task = await this.repo.findById(id);
    if (!task) throw new NotFoundException(`Task ${id} not found`);
    return task;
  }

  async update(id: number, dto: UpdateTaskDto): Promise<Task> {
    const task = await this.repo.update(id, dto);
    if (!task) throw new NotFoundException(`Task ${id} not found`);
    return task;
  }

  async remove(id: number): Promise<void> {
    const deleted = await this.repo.delete(id);
    if (!deleted) throw new NotFoundException(`Task ${id} not found`);
  }
}