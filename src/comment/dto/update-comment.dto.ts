import { PickType } from '@nestjs/swagger';
import { Comment } from '../database/comment.schema';

export class UpdateCommentDto extends PickType(Comment, [
  'content',
  'author',
] as const) {}
