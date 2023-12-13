import { PickType } from '@nestjs/swagger';
import { Friend } from '../database/friend.schema';

export class CreateFriendDto extends PickType(Friend, [
  'characterId',
  'friendId',
] as const) {}
