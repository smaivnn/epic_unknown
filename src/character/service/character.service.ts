import { Request } from 'express';
import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { CreateCharacterDto } from '../dto/create-character.dto';
import { UpdateCharacterDto } from '../dto/update-character.dto';
import { CharacterRepository } from '../database/character.repository';
import { User } from 'src/user/database/user.schema';
import { Character } from '../database/character.schema';
import { CharacterSubset } from 'src/constants/characterSubset';

@Injectable()
export class CharacterService {
  constructor(private readonly characterRepository: CharacterRepository) {}

  async create(body: CreateCharacterDto, request: Request) {
    const user = request.user as User;
    const { name } = body;
    const newCharacter = {
      name,
    };
    const createdCharacter = await this.characterRepository.createCharacter(
      newCharacter,
      user,
    );
    return createdCharacter.readOnlyData;
  }

  async findOne(requestOrUser: Request | User): Promise<CharacterSubset> {
    let user: User;
    if ('user' in requestOrUser) {
      user = requestOrUser.user as User;
    } else {
      user = requestOrUser as User;
    }
    const character = await this.characterRepository.findCharacter(user);

    return character;
  }

  async addStatsToCharacter(
    characterId: Types.ObjectId,
    statsIds: Types.ObjectId | Types.ObjectId[],
  ) {
    const character = await this.characterRepository.addStatsToCharacter(
      characterId,
      statsIds,
    );
    return character;
  }

  async findManyCharactersByCharacterIds(characterIds: Types.ObjectId[]) {
    const characters =
      await this.characterRepository.findManyCharactersByCharacterIds(
        characterIds,
      );
    return characters.map((character) => {
      const { _id, userId, name } = character;
      return { _id, userId, name };
    });
  }
}
