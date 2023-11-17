import { Module } from '@nestjs/common';
import { CharacterService } from './service/character.service';
import { CharacterController } from './controller/character.controller';

@Module({
  controllers: [CharacterController],
  providers: [CharacterService],
})
export class CharacterModule {}
