import { PickType } from '@nestjs/swagger';
import { Post } from '../database/post.schema';

export class CreatePostDto extends PickType(Post, [
  'title',
  'content',
  'category',
  'board',
  'author',
] as const) {}
