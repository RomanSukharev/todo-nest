import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service.js';
import { TasksController } from './tasks.controller.js';
import { TasksRepository } from './tasks.repository.js';

@Module({
  controllers: [TasksController],
  providers: [TasksService, TasksRepository],
})
export class TasksModule {}
