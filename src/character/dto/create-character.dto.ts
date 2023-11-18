import { PickType } from '@nestjs/swagger';
import { Character } from '../database/character.schema';
export class CreateCharacterDto extends PickType(Character, ['name']) {}
