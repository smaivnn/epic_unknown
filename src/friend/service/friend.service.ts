import { Injectable } from '@nestjs/common';
import { CreateFriendDto } from '../dto/create-friend.dto';
import { UpdateFriendDto } from '../dto/update-friend.dto';
import { FriendRepository } from '../database/friend.repository';
import { Types } from 'mongoose';
import { CharacterService } from 'src/character/service/character.service';

@Injectable()
export class FriendService {
  constructor(
    private readonly friendRepository: FriendRepository,
    private readonly characterService: CharacterService,
  ) {}
  create(body: CreateFriendDto) {
    const newFriend = this.friendRepository.createFriend(
      body.characterId,
      body.friendId,
    );
    return newFriend;
  }

  async findAllByCharacterId(characterId: string | Types.ObjectId) {
    const charactersIds =
      await this.friendRepository.getFriendsListByCharacterId(characterId);

    const friendList =
      await this.characterService.findManyCharactersByCharacterIds(
        charactersIds,
      );

    return friendList;
  }

  async findFriendRequestByCharacterId(characterId: string | Types.ObjectId) {
    const charactersIds =
      await this.friendRepository.getFriendRequestListByCharacterId(
        characterId,
      );

    const friendRequestList =
      await this.characterService.findManyCharactersByCharacterIds(
        charactersIds,
      );

    return friendRequestList;
  }

  findOneById(id: string | Types.ObjectId) {
    return this.friendRepository.findOneById(id);
  }

  checkIsAbleToRequestFriend(
    senderId: string | Types.ObjectId,
    receiverId: string | Types.ObjectId,
  ) {
    return this.friendRepository.checkIsAbleToRequestFriend(
      senderId,
      receiverId,
    );
  }

  update(id: string | Types.ObjectId, body: UpdateFriendDto) {
    return this.friendRepository.updateFriendStatus(id, body.status);
  }

  remove(userId: string | Types.ObjectId, friend: string | Types.ObjectId) {
    return this.friendRepository.removeFriend(userId, friend);
  }
}
