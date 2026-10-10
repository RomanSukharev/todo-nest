import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsOptional } from 'class-validator';
import { CreateTaskDto } from './create-task.dto.js';
import { TaskStatuses } from '../entities/task.entity.js';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @IsOptional()
  @IsEnum(TaskStatuses)
  status?: TaskStatuses;
}
