import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Model } from 'mongoose';
import { Friend } from './friend.schema';

@Injectable()
export class FriendRepository {
  constructor(
    @InjectModel(Friend.name)
    private readonly friendModel: Model<Friend>,
  ) {}

  async createFriend(senderId: Types.ObjectId, receiverId: Types.ObjectId) {
    const newFriend = new this.friendModel({
      characterId: senderId,
      friendId: receiverId,
    });
    const friend = await newFriend.save();
    return friend;
  }

  async findOneById(id: string | Types.ObjectId) {
    const friend = await this.friendModel.findOne({
      _id: id,
    });
    return friend;
  }

  async checkIsAbleToRequestFriend(
    senderId: string | Types.ObjectId,
    receiverId: string | Types.ObjectId,
  ) {
    const friend = await this.friendModel.findOne({
      $or: [
        {
          characterId: senderId,
          friendId: receiverId,
          status: { $in: ['pending', 'accepted', 'declined'] },
        },
        {
          characterId: receiverId,
          friendId: senderId,
          status: { $in: ['pending', 'accepted'] },
        },
      ],
    });
    return friend;
  }

  async updateFriendStatus(id: string | Types.ObjectId, status: string) {
    const friend = await this.friendModel.findOneAndUpdate(
      { _id: id },
      { status },
      { new: true },
    );
    return friend.readOnlyData;
  }

  async getFriendsListByCharacterId(characterId: string | Types.ObjectId) {
    characterId = new Types.ObjectId(characterId as string);
    const friends = await this.friendModel.find({
      $or: [
        {
          characterId,
          status: 'accepted',
        },
        { friendId: characterId, status: 'accepted' },
      ],
    });

    const friendsIdList = [];
    for (let i = 0; i < friends.length; i++) {
      if (friends[i].characterId.toString() === characterId.toString()) {
        friendsIdList.push(friends[i].friendId);
      } else if (friends[i].friendId.toString() === characterId.toString()) {
        friendsIdList.push(friends[i].characterId);
      }
    }

    return friendsIdList;
  }

  async getFriendRequestListByCharacterId(
    characterId: string | Types.ObjectId,
  ) {
    characterId = new Types.ObjectId(characterId as string);
    const friends = await this.friendModel.find({
      friendId: characterId,
      status: 'pending',
    });

    const friendsRequestIdList = [];
    for (let i = 0; i < friends.length; i++) {
      friendsRequestIdList.push(friends[i].characterId);
    }

    return friendsRequestIdList;
  }

  async removeFriend(
    userId: string | Types.ObjectId,
    friendId: string | Types.ObjectId,
  ) {
    userId = new Types.ObjectId(userId as string);
    friendId = new Types.ObjectId(friendId as string);
    await this.friendModel
      .deleteOne({
        $or: [
          { characterId: userId, friendId: friendId, status: 'accepted' },
          { characterId: friendId, friendId: userId, status: 'accepted' },
        ],
      })
      .exec();
  }
}
