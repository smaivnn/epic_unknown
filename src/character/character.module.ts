import { Module, forwardRef } from '@nestjs/common';
import { CharacterService } from './service/character.service';
import { CharacterController } from './controller/character.controller';
import { CharacterRepository } from './database/character.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Character, CharacterSchema } from './database/character.schema';
import { StatModule } from '../stat/stat.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Character.name, schema: CharacterSchema },
    ]),
    forwardRef(() => CharacterModule),
    forwardRef(() => StatModule),
  ],
  controllers: [CharacterController],
  providers: [CharacterService, CharacterRepository],
  exports: [CharacterService, CharacterRepository],
})
export class CharacterModule {}
