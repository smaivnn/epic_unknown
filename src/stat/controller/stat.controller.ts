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
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { StatService } from '../service/stat.service';
import { CreateStatDto } from '../dto/create-stat.dto';
import { UpdateStatDto } from '../dto/update-stat.dto';
import { JwtAuthGuard } from 'src/auth/jwt/access-auth.guard';
import { ExtractCharacterIdInterceptor } from '../../common/interceptor/find-characterId.interceptor';
import { CharacterService } from 'src/character/service/character.service';

@ApiTags('Stat')
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
}
