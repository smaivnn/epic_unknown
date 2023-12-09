import { PickType } from '@nestjs/swagger';
import { Post } from '../database/post.schema';

export class UpdatePostDto extends PickType(Post, [
  'title',
  'content',
  'category',
  'author',
] as const) {}
