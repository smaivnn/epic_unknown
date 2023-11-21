import { PickType } from '@nestjs/swagger';
import { Stat } from '../database/stat.schema';
import { Types } from 'mongoose';

export class CreateStatDto extends PickType(Stat, ['name'] as const) {
  characterId: string | Types.ObjectId;
}
