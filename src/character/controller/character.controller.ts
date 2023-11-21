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
import { BasicStat } from '../../constants/stats.constants';

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

    const statsIds = await Promise.all(
      Object.values(BasicStat).map(async (stat) => {
        const stats = await this.statService.create({
          name: stat,
          characterId: character._id,
        });
        return stats._id;
      }),
    );

    const newCharacter = await this.characterService.addStatsToCharacter(
      character._id,
      statsIds,
    );
    return newCharacter;
  }

  @Get()
  findAll() {
    return this.characterService.findAll();
  }

  @Get('id')
  findOne(@Req() request: Request) {
    return this.characterService.findOne(request);
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
