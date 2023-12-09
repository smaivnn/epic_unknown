import { PostService } from './../../post/service/post.service';
import { Injectable } from '@nestjs/common';
import { CommentRepository } from '../database/comment.repository';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { UpdateCommentDto } from '../dto/update-comment.dto';
import { Request } from 'express';
import { User } from 'src/user/database/user.schema';

@Injectable()
export class CommentService {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly postService: PostService,
  ) {}

  async create(body: CreateCommentDto, request: Request) {
    const user = request.user;
    const { content, postId, author } = body;
    const newComment = {
      content,
      postId,
      author,
    };
    const comment = await this.commentRepository.createComment(
      newComment,
      user,
    );

    const { _id } = comment;

    const postWithComments = await this.postService.addCommentToPost(
      _id,
      postId,
    );

    return postWithComments;
  }

  findAll() {
    return `This action returns all comment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  async update(
    id: string,
    updateCommentDto: UpdateCommentDto,
    request: Request,
  ) {
    const user = request.user as User;
    const newComment = {
      ...updateCommentDto,
    };

    const comment = await this.commentRepository.updateComment(
      id,
      newComment,
      user,
    );

    const { postId } = comment;
    const post = await this.postService.findOne(postId);

    return post;
  }

  async remove(id: string, request: Request) {
    const user = request.user as User;

    const comment = await this.commentRepository.removeComment(id, user);

    const { _id, postId } = comment;
    const postWithComments = await this.postService.removeCommentFromPost(
      _id,
      postId,
    );

    return postWithComments;
  }
}
