import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Model } from 'mongoose';
import { Character } from './character.schema';
import { CreateCharacterDto } from '../dto/create-character.dto';
import { User } from 'src/user/database/user.schema';
import { CharacterSubset } from '../../constants/characterSubset';

@Injectable()
export class CharacterRepository {
  constructor(
    @InjectModel(Character.name)
    private readonly characterModel: Model<Character>,
  ) {}

  async createCharacter(
    character: CreateCharacterDto,
    user: User,
  ): Promise<Character> {
    const userId = user._id;

    const foundCharacter = await this.characterModel.findOne({ userId }).exec();
    if (foundCharacter) {
      throw new Error('이미 캐릭터가 존재합니다.');
    }

    const newCharacter = {
      ...character,
      userId,
    };
    const createdCharacter = await this.characterModel.create(newCharacter);

    return createdCharacter;
  }

  async addStatsToCharacter(
    characterId: Types.ObjectId,
    statsIds: Types.ObjectId | Types.ObjectId[],
  ): Promise<CharacterSubset> {
    const statsIdsArray = Array.isArray(statsIds) ? statsIds : [statsIds];
    const updatedCharacter = await this.characterModel
      .findByIdAndUpdate(
        characterId,
        { $push: { stats: { $each: statsIdsArray } } },
        { new: true },
      )
      .populate('stats')
      .exec();

    const { readOnlyData } = updatedCharacter;
    const transformedStats = readOnlyData.stats.map(
      (stat: any) => stat.readOnlyData,
    );

    return {
      ...readOnlyData,
      stats: transformedStats,
    };
  }

  async findCharacter(
    userOrId: User | string | Types.ObjectId,
  ): Promise<CharacterSubset> {
    let userId;
    if (typeof userOrId === 'string' || userOrId instanceof Types.ObjectId) {
      userId = userOrId;
    } else {
      userId = userOrId._id;
    }
    const foundCharacter = await this.characterModel
      .findOne({ userId })
      .populate('stats')
      .exec();

    if (!foundCharacter) {
      throw new Error('캐릭터가 존재하지 않습니다.');
    }

    const { readOnlyData } = foundCharacter;
    const transformedStats = readOnlyData.stats.map(
      (stat: any) => stat.readOnlyData,
    );

    return {
      ...readOnlyData,
      stats: transformedStats,
    };
  }

  async findManyCharactersByCharacterIds(characterIds: Types.ObjectId[]) {
    const foundCharacters = await this.characterModel
      .find(
        {
          _id: { $in: characterIds },
        },
        { _id: 1, name: 1, userId: 1 },
      )
      .exec();
    return foundCharacters;
  }
}
