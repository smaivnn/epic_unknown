import { PickType } from '@nestjs/swagger';
import { Comment } from '../database/comment.schema';

export class CreateCommentDto extends PickType(Comment, [
  'content',
  'postId',
  'author',
] as const) {}
