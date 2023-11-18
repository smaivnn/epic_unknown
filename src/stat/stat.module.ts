import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StatService } from './service/stat.service';
import { StatController } from './controller/stat.controller';
import { Stat, StatSchema } from './database/stat.schema';
import { StatRepository } from './database/stat.repository';
import { CharacterModule } from '../character/character.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Stat.name, schema: StatSchema }]),
    forwardRef(() => StatModule),
    forwardRef(() => CharacterModule),
  ],
  controllers: [StatController],
  providers: [StatService, StatRepository],
  exports: [StatService, StatRepository],
})
export class StatModule {}
