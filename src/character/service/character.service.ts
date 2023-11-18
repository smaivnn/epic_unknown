import { Request } from 'express';
import { Injectable } from '@nestjs/common';
import { CreateCharacterDto } from '../dto/create-character.dto';
import { UpdateCharacterDto } from '../dto/update-character.dto';
import { CharacterRepository } from '../database/character.repository';

@Injectable()
export class CharacterService {
  constructor(private readonly characterRepository: CharacterRepository) {}
  
  async create(body: CreateCharacterDto, request: Request) {
    const user = request.user;
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

  findOne(id: number) {
    return `This action returns a #${id} character`;
  }

  update(id: number, updateCharacterDto: UpdateCharacterDto) {
    return `This action updates a #${id} character`;
  }

  remove(id: number) {
    return `This action removes a #${id} character`;
  }
}
