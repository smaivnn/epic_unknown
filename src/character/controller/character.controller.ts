import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { CharacterService } from '../service/character.service';
import { StatService } from 'src/stat/service/stat.service';
import { CreateCharacterDto } from '../dto/create-character.dto';
import { UpdateCharacterDto } from '../dto/update-character.dto';
import { JwtAuthGuard } from 'src/auth/jwt/access-auth.guard';
import { Stat } from '../../constants/stat.enum';

@UseGuards(JwtAuthGuard)
@Controller('character')
export class CharacterController {
  constructor(
    private readonly characterService: CharacterService,
    private readonly statService: StatService,
  ) {}

  @Post()
  async create(@Body() body: CreateCharacterDto, @Req() request: Request) {
    const character = await this.characterService.create(body, request);
    await Promise.all([
      Object.values(Stat).map((stat) =>
        this.statService.create({ name: stat, characterId: character._id }),
      ),
    ]);

    return character;
  }

  @Get()
  findAll() {
    return this.characterService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.characterService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCharacterDto: UpdateCharacterDto,
  ) {
    return this.characterService.update(+id, updateCharacterDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.characterService.remove(+id);
  }
}
