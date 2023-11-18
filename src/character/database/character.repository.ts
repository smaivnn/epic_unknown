import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Character } from './character.schema';
import { CreateCharacterDto } from '../dto/create-character.dto';

@Injectable()
export class CharacterRepository {
  constructor(
    @InjectModel(Character.name)
    private readonly characterModel: Model<Character>,
  ) {}

  async createCharacter(
    character: CreateCharacterDto,
    user,
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

  async findCharacter(user): Promise<Character> {
    const userId = user._id;
    const foundCharacter = await this.characterModel.findOne({ userId }).exec();
    if (!foundCharacter) {
      throw new Error('캐릭터가 존재하지 않습니다.');
    }

    return foundCharacter;
  }
}
