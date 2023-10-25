import { PickType } from '@nestjs/swagger';
import { ToDo } from '../database/to-do.schema';

export class UpdateToDoDto extends PickType(ToDo, [
  'title',
  'content',
  'dueDate',
  'category',
] as const) {
  todoId: string;
}
