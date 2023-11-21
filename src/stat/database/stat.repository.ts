import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Stat } from './stat.schema';
import { CreateStatDto } from '../dto/create-stat.dto';

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
}
