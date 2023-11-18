import { Request } from 'express';
import { CharacterRepository } from 'src/character/database/character.repository';
import { StatRepository } from 'src/stat/database/stat.repository';
import { Injectable } from '@nestjs/common';
import { CreateStatDto } from '../dto/create-stat.dto';
import { UpdateStatDto } from '../dto/update-stat.dto';

@Injectable()
export class StatService {
  constructor(
    private readonly statRepository: StatRepository,
    private readonly characterRepository: CharacterRepository,
  ) {}

  async create(body: CreateStatDto) {
    const { name, characterId } = body;

    const newStat = {
      characterId,
      name,
    };
    const createdStat = await this.statRepository.createStat(newStat);

    return createdStat;
  }

  findAll() {
    return `This action returns all stat`;
  }

  findOne(id: number) {
    return `This action returns a #${id} stat`;
  }

  update(id: number, updateStatDto: UpdateStatDto) {
    return `This action updates a #${id} statd`;
  }

  remove(id: number) {
    return `This action removes a #${id} stat`;
  }
}
