import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/database/user.schema';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async findUserByEmail(email: string): Promise<User | null> {
    const foundUser = await this.userModel.findOne({ email });

    return foundUser;
  }

  async getUser() {
    const foundUserList = await this.userModel.find();
    return foundUserList;
  }

  async findUserById(id: string): Promise<User | null> {
    const foundUser = await this.userModel
      .findOne({ _id: id })
      .select('-password');

    return foundUser;
  }

  async updateLikedPost(user: User, index: number, postId: string) {
    let updatedUser;
    if (index === -1) {
      updatedUser = await this.userModel.findOneAndUpdate(
        { _id: user._id },
        { $push: { likedPosts: postId } },
        { new: true },
      );
    } else {
      updatedUser = await this.userModel.findOneAndUpdate(
        { _id: user._id },
        { $pull: { likedPosts: postId } },
        { new: true },
      );
    }

    return updatedUser;
  }
}
