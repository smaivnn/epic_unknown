import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { StatService } from '../service/stat.service';
import { CreateStatDto } from '../dto/create-stat.dto';
import { UpdateStatDto } from '../dto/update-stat.dto';
import { JwtAuthGuard } from 'src/auth/jwt/access-auth.guard';
import { ExtractCharacterIdInterceptor } from '../../common/interceptor/find-characterId.interceptor';
import { CharacterService } from 'src/character/service/character.service';

@UseGuards(JwtAuthGuard)
@Controller('stat')
@UseInterceptors(ExtractCharacterIdInterceptor)
export class StatController {
  constructor(
    private readonly statService: StatService,
    private readonly characterService: CharacterService,
  ) {}

  @Post()
  async create(@Body() body: CreateStatDto, @Req() request: Request) {
    const stat = await this.statService.create(body, request);

    const { characterId, _id } = stat;

    return await this.characterService.addStatsToCharacter(characterId, _id);
  }

  @Get()
  findAll() {
    return this.statService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.statService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStatDto: UpdateStatDto) {
    return this.statService.update(+id, updateStatDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.statService.remove(+id);
  }
}
