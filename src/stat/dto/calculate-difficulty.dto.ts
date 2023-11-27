import { PickType } from '@nestjs/swagger';
import { ToDo } from '../../to-do/database/to-do.schema';
import { Types } from 'mongoose';

export class CalculateDifficultyDto extends PickType(ToDo, [
  'difficulty',
] as const) {
  // characterId: string | Types.ObjectId;
}
