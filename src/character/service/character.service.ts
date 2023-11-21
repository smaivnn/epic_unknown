import { Request } from 'express';
import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { CreateCharacterDto } from '../dto/create-character.dto';
import { UpdateCharacterDto } from '../dto/update-character.dto';
import { CharacterRepository } from '../database/character.repository';
import { User } from 'src/user/database/user.schema';

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

  findAll() {
    return `This action returns all character`;
  }

  async findOne(request: Request) {
    const user = request.user as User;
    const character = await this.characterRepository.findCharacter(user);

    return character;
  }

  update(id: number, updateCharacterDto: UpdateCharacterDto) {
    return `This action updates a #${id} character`;
  }

  remove(id: number) {
    return `This action removes a #${id} character`;
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
}
