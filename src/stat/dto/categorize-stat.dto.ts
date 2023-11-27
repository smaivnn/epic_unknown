import { PickType } from '@nestjs/swagger';
import { ToDo } from '../../to-do/database/to-do.schema';
import { Types } from 'mongoose';

export class CategorizeDto extends PickType(ToDo, ['category'] as const) {
  // characterId: string | Types.ObjectId;
}
