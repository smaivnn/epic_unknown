import { Request } from 'express';
import { Injectable } from '@nestjs/common';
import { PostRepository } from '../database/post.repository';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { postType } from 'src/constants/category.enum';
import { Board } from 'src/constants/board.enum';
import { User } from 'src/user/database/user.schema';
// import { Post } from '../database/post.schema';
import { Types } from 'mongoose';
import { Post } from '../database/post.schema';
import { UserService } from 'src/user/service/user.service';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly userService: UserService,
  ) {
    setInterval(
      () => {
        const now = Date.now();
        for (const [key, lastViewTime] of this.lastViewTimes) {
          if (now - lastViewTime > 60 * 60 * 1000) {
            this.lastViewTimes.delete(key);
          }
        }
      },
      60 * 60 * 1000,
    );
  }

  private lastViewTimes = new Map<string, number>();

  async create(body: CreatePostDto, request: Request) {
    const user = request.user;

    const { title, content, category, board, author } = body;
    // Validate category
    if (!Object.values(postType).includes(category as postType)) {
      throw new Error(`Invalid category: ${category}`);
    }

    // Validate board
    if (!Object.values(Board).includes(board as Board)) {
      throw new Error(`Invalid board: ${board}`);
    }
    const newPost = {
      title,
      content,
      category,
      board,
      author,
    };
    const createdPost = await this.postRepository.createPost(newPost, user);
    const { readOnlyDataForSinglePost, createdAt } = createdPost;
    const readOnlyPost = { ...readOnlyDataForSinglePost, createdAt };
    return readOnlyPost;
  }

  async findAllByUser(userId: string) {
    const allPost = await this.postRepository.findAllByUser(userId);
    const readOnlyPost = allPost.map((post) => post.readOnlyDataForList);
    return readOnlyPost;
  }

  async findAllByBoard(boardName: string) {
    const allPost = await this.postRepository.findAllByBoard(boardName);
    const readOnlyPost = allPost.map((post) => post.readOnlyDataForList);
    return readOnlyPost;
  }

  async findOne(id: string | Types.ObjectId) {
    const post = await this.postRepository.findOne(id);

    return post;
  }

  async update(id: string, body: UpdatePostDto, request: Request) {
    const user = request.user as User;
    const { title, content, category, author } = body;
    const foundPost = await this.postRepository.findOne(id);
    if (foundPost.userId !== user._id) {
      throw new Error('This is not your post');
    }
    const newPost = {
      title,
      content,
      category,
      author,
    };
    const updatedPost = await this.postRepository.updatePost(newPost, id);
    const readOnlyPost = updatedPost.readOnlyDataForSinglePost;
    return readOnlyPost;
  }

  async remove(id: string, request: Request) {
    const user = request.user as User;
    const foundPost = await this.postRepository.findOne(id);
    if (foundPost.userId !== user._id) {
      throw new Error('This is not your post');
    }
    const removedPost = await this.postRepository.removePost(id);
    const readOnlyPost = removedPost.readOnlyDataForSinglePost;
    return readOnlyPost;
  }

  async addCommentToPost(
    commentId: string | Types.ObjectId,
    postId: string | Types.ObjectId,
  ) {
    const post = await this.postRepository.addCommentToPost(commentId, postId);
    return post;
  }

  async removeCommentFromPost(
    commentId: string | Types.ObjectId,
    postId: string | Types.ObjectId,
  ) {
    const post = await this.postRepository.removeCommentFromPost(
      commentId,
      postId,
    );
    return post;
  }

  async view(postId: string | Types.ObjectId, request: Request): Promise<Post> {
    const user = request.user as User;
    const userId = user._id;
    const key = `${postId}:${userId}`;
    const now = Date.now();

    const lastViewTime = this.lastViewTimes.get(key) || 0;
    let viewUpdatedPost: Post;

    if (now - lastViewTime >= 10 * 60 * 1000) {
      const post = await this.postRepository.findOne(postId);
      if (!post) {
        throw new Error('Post not found');
      }

      viewUpdatedPost = await this.postRepository.increaseView(postId);

      this.lastViewTimes.set(key, now);
    }

    return viewUpdatedPost;
  }

  async toggleLike(postId: string | Types.ObjectId, request: Request) {
    const user = request.user as User;
    const post = await this.postRepository.findOne(postId);
    if (!post) {
      throw new Error('Post not found');
    }

    // 유저의 likedPosts에서 인덱스를 확인한다.
    const likedIndex = user.likedPosts.indexOf(postId.toString());

    const [_, updatedPost] = await Promise.all([
      this.userService.updateLikedPost(user, likedIndex, postId.toString()),
      this.postRepository.toggleLike(post._id, likedIndex),
    ]);

    return updatedPost;
  }
}
