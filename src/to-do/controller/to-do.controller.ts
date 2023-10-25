import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { ToDoService } from '../service/to-do.service';
import { CreateToDoDto } from '../dto/create-to-do.dto';
import { UpdateToDoDto } from '../dto/update-to-do.dto';
import { SingleToDoDto } from '../dto/single-to-do.dto';
import { ChangeTodoPriorityDto } from '../dto/priority-to-do.dto';
import { JwtAuthGuard } from 'src/auth/jwt/access-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('todos')
export class ToDoController {
  constructor(private readonly toDoService: ToDoService) {}

  @Post()
  async create(@Body() body: CreateToDoDto, @Req() request: Request) {
    return await this.toDoService.create(body, request);
  }

  @Get()
  async findAll(@Req() request: Request) {
    return this.toDoService.findAll(request);
  }

  @Patch('update')
  update(@Body() body: UpdateToDoDto) {
    return this.toDoService.update(body);
  }

  @Patch('complete')
  complete(@Body() body: SingleToDoDto, @Req() request: Request) {
    return this.toDoService.complete(body, request);
  }

  @Delete('remove')
  remove(@Body() body: SingleToDoDto, @Req() request: Request) {
    return this.toDoService.remove(body, request);
  }

  @Patch('priority')
  updatePriority(@Body() body: ChangeTodoPriorityDto, @Req() request: Request) {
    return this.toDoService.changeToDoPriority(body, request);
  }
}
