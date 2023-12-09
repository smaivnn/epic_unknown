import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Post } from './post.schema';

@Injectable()
export class PostRepository {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
  ) {}

  async createPost(post, user): Promise<Post> {
    const userId = user._id;
    const newPost = {
      ...post,
      userId,
    };

    const createdPost = await this.postModel.create(newPost);
    return createdPost;
  }

  async findAllByUser(userId: string): Promise<Post[]> {
    const allPost = await this.postModel
      .find({ userId, isDeleted: false })
      .exec();
    return allPost;
  }

  async findAllByBoard(boardName: string): Promise<Post[]> {
    const allPost = await this.postModel
      .find({ board: boardName, isDeleted: false })
      .exec();
    return allPost;
  }

  async findOne(id: string | Types.ObjectId): Promise<Post> {
    const post = await this.postModel
      .findOne({ _id: id, isDeleted: false })
      .populate('comments');

    const { readOnlyDataForSinglePost } = post;
    if (post.comments.length === 0) return readOnlyDataForSinglePost as Post;

    const transformedComments = readOnlyDataForSinglePost.comments.map(
      (comment: any) => comment.readOnlyData,
    );

    return {
      ...readOnlyDataForSinglePost,
      comments: transformedComments,
    } as Post;
  }

  async updatePost(newPost, postId): Promise<Post> {
    const updatedPost = await this.postModel
      .findOneAndUpdate({ _id: postId }, newPost, { new: true })
      .exec();
    return updatedPost;
  }

  async removePost(postId): Promise<Post> {
    const deletedPost = await this.postModel
      .findOneAndUpdate({ _id: postId }, { isDeleted: true }, { new: true })
      .exec();
    return deletedPost;
  }

  async addCommentToPost(
    commentId: string | Types.ObjectId,
    postId: string | Types.ObjectId,
  ): Promise<Post> {
    const updatedPost = await this.postModel
      .findOneAndUpdate(
        { _id: postId },
        { $push: { comments: commentId } },
        { new: true },
      )
      .populate('comments')
      .exec();

    const { readOnlyDataForSinglePost } = updatedPost;

    const transformedComments = readOnlyDataForSinglePost.comments.map(
      (comment: any) => comment.readOnlyData,
    );

    return {
      ...readOnlyDataForSinglePost,
      comments: transformedComments,
    } as Post;
  }

  async removeCommentFromPost(
    commentId: string | Types.ObjectId,
    postId: string | Types.ObjectId,
  ): Promise<Post> {
    const updatedPost = await this.postModel
      .findOneAndUpdate(
        { _id: postId },
        { $pull: { comments: commentId } },
        { new: true },
      )
      .populate('comments')
      .exec();

    const { readOnlyDataForSinglePost } = updatedPost;

    const transformedComments = readOnlyDataForSinglePost.comments.map(
      (comment: any) => comment.readOnlyData,
    );

    return {
      ...readOnlyDataForSinglePost,
      comments: transformedComments,
    } as Post;
  }

  async increaseView(postId: string | Types.ObjectId) {
    const updatedPost = await this.postModel
      .findOneAndUpdate({ _id: postId }, { $inc: { views: 1 } }, { new: true })
      .exec();

    return updatedPost;
  }

  async toggleLike(postId: string | Types.ObjectId, likeIndex: number) {
    if (likeIndex === -1) {
      await this.postModel.findOneAndUpdate(
        { _id: postId },
        { $inc: { upvotes: 1 } },
      );
    } else {
      await this.postModel.updateOne(
        { _id: postId, upvotes: { $gt: 0 } },
        { $inc: { upvotes: -1 } },
      );
    }
    const post = await this.findOne(postId);
    return post.upvotes;
  }
}
