import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service.js';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';
import { QueryTasksDto } from './dto/query-tasks.dto.js';
import { Task } from './entities/task.entity.js';

const COLUMNS = `id, title, description, status, created_at AS "createdAt"`;

@Injectable()
export class TasksRepository {
  constructor(private readonly db: DatabaseService) {}

  async insert(dto: CreateTaskDto): Promise<Task> {
    const { rows } = await this.db.query<Task>(
      `INSERT INTO tasks (title, description)
       VALUES ($1, $2)
       RETURNING ${COLUMNS}`,
      [dto.title, dto.description ?? null],
    );
    return rows[0];
  }

  async findMany(query: QueryTasksDto): Promise<{ rows: Task[]; total: number }> {
    const { status, search, page, limit, orderBy } = query;

    const conditions: string[] = [];
    const params: unknown[] = [];

    if (status) {
      params.push(status);
      conditions.push(`status = $${params.length}`);
    }
    if (search) {
      params.push(`%${search}%`);
      conditions.push(`title ILIKE $${params.length}`);
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const direction = orderBy === 'asc' ? 'ASC' : 'DESC';

    const count = await this.db.query<{ count: string }>(
      `SELECT COUNT(*) FROM tasks ${where}`,
      params,
    );

    const { rows } = await this.db.query<Task>(
      `SELECT ${COLUMNS} FROM tasks ${where}
       ORDER BY created_at ${direction}, id ${direction}
       LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      [...params, limit, (page - 1) * limit],
    );

    return { rows, total: Number(count.rows[0].count) };
  }

  async findById(id: number): Promise<Task | null> {
    const { rows } = await this.db.query<Task>(
      `SELECT ${COLUMNS} FROM tasks WHERE id = $1`,
      [id],
    );
    return rows[0] ?? null;
  }

  async update(id: number, dto: UpdateTaskDto): Promise<Task | null> {
    const { rows } = await this.db.query<Task>(
      `UPDATE tasks
       SET title       = COALESCE($1, title),
           description = COALESCE($2, description),
           status      = COALESCE($3, status),
           updated_at  = now()
       WHERE id = $4
       RETURNING ${COLUMNS}`,
      [dto.title ?? null, dto.description ?? null, dto.status ?? null, id],
    );
    return rows[0] ?? null;
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.db.query(`DELETE FROM tasks WHERE id = $1`, [id]);
    return (result.rowCount ?? 0) > 0;
  }
}