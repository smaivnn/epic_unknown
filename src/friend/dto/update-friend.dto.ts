import { PickType } from '@nestjs/swagger';
import { Friend } from '../database/friend.schema';

export class UpdateFriendDto extends PickType(Friend, ['status'] as const) {}
