import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';
import { Task } from './entities/task.entity.js';
import { TaskStatuses, PaginatedResult } from './entities/task.entity.js';
import { QueryTasksDto } from './dto/query-tasks.dto.js';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];
  private nextId = 1;

  create(dto: CreateTaskDto): Task {
    const task: Task = {
      id: this.nextId++,
      title: dto.title,
      description: dto.description ?? '',
      status: TaskStatuses.PENDING,
      createdAt: new Date(),
    };
    this.tasks.push(task);
    return task;
  }

  findAll(query: QueryTasksDto): PaginatedResult<Task> {
    const { status, search, page, limit, orderBy } = query;

    let result = [...this.tasks];

    if (status) {
      result = result.filter((task) => task.status === status);
    }

    if (search) {
      result = result.filter((task) =>
        task.title.toLowerCase().includes(search.toLowerCase()),
      );
    }


    result.sort((a, b) =>
      orderBy === 'asc'
        ? a.createdAt.getTime() - b.createdAt.getTime()
        : b.createdAt.getTime() - a.createdAt.getTime(),
    );

    const total = result.length;
    const start = (page - 1) * limit;
    const data = result.slice(start, start + limit);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  findOne(id: number): Task {
    const task = this.tasks.find((task) => task.id === id);
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  update(id: number, dto: UpdateTaskDto): Task {
    const task = this.findOne(id);
    Object.assign(task, dto);
    return task;
  }

  remove(id: number): Task {
    const task = this.findOne(id);
    this.tasks = this.tasks.filter((t) => t.id !== id);
    return task;
  }
}
