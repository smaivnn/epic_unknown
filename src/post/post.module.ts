import { Module, forwardRef } from '@nestjs/common';
import { PostService } from './service/post.service';
import { PostController } from './controller/post.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './database/post.schema';
import { PostRepository } from './database/post.repository';
import { CommentModule } from 'src/comment/comment.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    forwardRef(() => CommentModule),
    forwardRef(() => UserModule),
  ],
  controllers: [PostController],
  providers: [PostService, PostRepository],
  exports: [PostService, PostRepository],
})
export class PostModule {}
