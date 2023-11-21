import { Request } from 'express';
import { CharacterRepository } from 'src/character/database/character.repository';
import { StatRepository } from 'src/stat/database/stat.repository';
import { Injectable } from '@nestjs/common';
import { CreateStatDto } from '../dto/create-stat.dto';
import { UpdateStatDto } from '../dto/update-stat.dto';
import { AllStat } from '../../constants/stats.constants';
import { Types } from 'mongoose';
import { Character } from 'src/character/database/character.schema';

interface RequestWithCharacterId extends Request {
  character?: Character;
}

type StatName = (typeof AllStat)[keyof typeof AllStat];

function isStatName(name: string): name is StatName {
  return Object.values(AllStat).includes(name as StatName);
}

@Injectable()
export class StatService {
  constructor(
    private readonly statRepository: StatRepository,
    private readonly characterRepository: CharacterRepository,
  ) {}

  async create(body: CreateStatDto, request: RequestWithCharacterId = null) {
    const { name } = body;

    const characterId = body.characterId || request.character._id;

    const isStat = isStatName(name);
    if (!isStat) {
      throw new Error('Stat name is not valid');
    }

    const newStat = {
      characterId,
      name,
    };
    const createdStat = await this.statRepository.createStat(newStat);

    return createdStat.readOnlyData;
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
