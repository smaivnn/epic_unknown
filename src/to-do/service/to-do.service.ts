import { Request } from 'express';
import { ToDoRepository } from './../database/to-do.repository';
import { Injectable } from '@nestjs/common';
import { CreateToDoDto } from '../dto/create-to-do.dto';
import { UpdateToDoDto } from '../dto/update-to-do.dto';
import { SingleToDoDto } from '../dto/single-to-do.dto';
import { ChangeTodoPriorityDto } from '../dto/priority-to-do.dto';
import { StatService } from 'src/stat/service/stat.service';

@Injectable()
export class ToDoService {
  constructor(
    private readonly toDoRepository: ToDoRepository,
    private readonly statService: StatService,
  ) {}
  async create(body: CreateToDoDto, request: Request) {
    const { title, content, dueDate, category, difficulty } = body;
    const user = request.user;
    const newToDo = {
      title,
      content,
      dueDate,
      category,
      difficulty,
    };

    const createdToDo = await this.toDoRepository.createToDo(newToDo, user);

    return createdToDo.readOnlyData;
  }

  async findAll(request: Request) {
    const user = request.user;
    const allToDo = await this.toDoRepository.findAllToDo(user);
    const readOnlyToDo = allToDo.map((todo) => todo.readOnlyData);
    return readOnlyToDo;
  }

  async update(body: UpdateToDoDto) {
    const { todoId, title, content, dueDate, category } = body;
    const newToDo = {
      title,
      content,
      dueDate,
      category,
    };
    const updatedToDo = await this.toDoRepository.updateToDo(newToDo, todoId);

    return updatedToDo.readOnlyData;
  }

  async remove(body: SingleToDoDto, request: Request) {
    const user = request.user;
    const { todoId } = body;
    const removedToDo = await this.toDoRepository.removeToDo(todoId, user);

    return removedToDo.readOnlyData;
  }

  async complete(body: SingleToDoDto, request: Request) {
    const user = request.user;
    const { todoId } = body;
    const completedToDo = await this.toDoRepository.completeToDo(todoId, user);
    const stat = await this.statService.categorizeStats({
      category: completedToDo.category,
    });
    const experiencePoint =
      await this.statService.caculateAccordingToDifficulty({
        difficulty: completedToDo.difficulty,
      });

    const continuePoint =
      await this.statService.awardBonusForDaily(completedToDo);

    console.log(stat, experiencePoint, continuePoint);
    return completedToDo.readOnlyData;
  }

  async changeToDoPriority(todos: ChangeTodoPriorityDto, request: Request) {
    const user = request.user;
    const changedPriorityToDo = await this.toDoRepository.changeToDoPriority(
      todos.todoIds,
      user,
    );

    const readOnlyToDo = changedPriorityToDo.map((todo) => todo.readOnlyData);
    return readOnlyToDo;
  }
}
