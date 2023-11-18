import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { StatService } from '../service/stat.service';
import { CreateStatDto } from '../dto/create-stat.dto';
import { UpdateStatDto } from '../dto/update-stat.dto';
import { JwtAuthGuard } from 'src/auth/jwt/access-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('stat')
export class StatController {
  constructor(private readonly statService: StatService) {}

  @Post()
  create(@Body() createStatDto: CreateStatDto) {
    // return this.statService.create();
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
