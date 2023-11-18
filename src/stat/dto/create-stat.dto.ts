import { PickType } from '@nestjs/swagger';
import { Stat } from '../database/stat.schema';

export class CreateStatDto extends PickType(Stat, ['name'] as const) {
  characterId: string;
}
