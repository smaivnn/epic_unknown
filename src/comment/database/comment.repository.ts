import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Model } from 'mongoose';
import { Comment } from './comment.schema';

@Injectable()
export class CommentRepository {
  constructor(
    @InjectModel(Comment.name)
    private readonly comment: Model<Comment>,
  ) {}

  async createComment(comment, user): Promise<Comment> {
    const userId = user._id;
    const newComment = {
      ...comment,
      userId,
    };
    const createdComment = await this.comment.create(newComment);
    return createdComment;
  }

  async removeComment(id: string, user): Promise<Comment> {
    const userId = user._id;
    const comment = await this.comment
      .findOneAndUpdate(
        { _id: id, userId, isDeleted: false },
        { isDeleted: true },
        { new: true },
      )
      .exec();

    return comment;
  }

  async updateComment(id: string, comment, user): Promise<Comment> {
    const userId = user._id;
    const updatedComment = await this.comment
      .findOneAndUpdate({ _id: id, userId, isDeleted: false }, comment, {
        new: true,
      })
      .exec();
    return updatedComment;
  }
}
