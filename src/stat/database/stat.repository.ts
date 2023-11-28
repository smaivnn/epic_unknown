import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Stat } from './stat.schema';
import { CreateStatDto } from '../dto/create-stat.dto';
import { experiencePerLevel, level } from 'src/constants/level';

@Injectable()
export class StatRepository {
  constructor(
    @InjectModel(Stat.name)
    private readonly statModel: Model<Stat>,
  ) {}

  async createStat(stat: CreateStatDto): Promise<Stat> {
    const existingStat = await this.statModel.findOne(stat).exec();
    if (existingStat) {
      throw new Error('Stat already exists');
    }
    const newStat = {
      ...stat,
    };
    const createdStat = await this.statModel.create(newStat);

    return createdStat.toObject();
  }

  async findStatByCharacterIdAndStatName(
    characterId: string | Types.ObjectId,
    statName: string,
  ): Promise<Stat> {
    const foundStat = await this.statModel
      .findOne({ characterId, name: statName })
      .exec();
    return foundStat;
  }

  async updateStatExp(stat: Stat, exp: number): Promise<Stat> {
    if (stat.level >= level.maxLevel) {
      return stat;
    }
    stat.currentExperience += exp;
    if (stat.currentExperience >= stat.experienceToLevelUp) {
      stat.currentExperience -= stat.experienceToLevelUp;
      stat.level += 1;
      stat.experienceToLevelUp = experiencePerLevel[`level${stat.level}`];
    }
    stat.save();
    return stat;
  }
}
