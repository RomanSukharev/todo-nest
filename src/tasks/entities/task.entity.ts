export enum TaskStatuses {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed'
}

export class Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatuses;
  createdAt: Date;
}