import { Request } from 'express';
import { CharacterRepository } from 'src/character/database/character.repository';
import { StatRepository } from 'src/stat/database/stat.repository';
import { Injectable } from '@nestjs/common';
import { CreateStatDto } from '../dto/create-stat.dto';
import { UpdateStatDto } from '../dto/update-stat.dto';
import { CategorizeDto } from '../dto/categorize-stat.dto';
import { AllStat } from '../../constants/stats.constants';
import { Character } from 'src/character/database/character.schema';
import { TodoCategory } from 'src/constants/category.enum';
import { CalculateDifficultyDto } from '../dto/calculate-difficulty.dto';
import { ToDo } from 'src/to-do/database/to-do.schema';
import { ToDoRepository } from 'src/to-do/database/to-do.repository';

interface RequestWithCharacterId extends Request {
  character?: Character;
}

type StatName = (typeof AllStat)[keyof typeof AllStat];

function isStatName(name: string): name is StatName {
  return Object.values(AllStat).includes(name as StatName);
}

@Injectable()
export class StatService {
  constructor(
    private readonly statRepository: StatRepository,
    private readonly characterRepository: CharacterRepository,
    private readonly toDoRepository: ToDoRepository,
  ) {}

  async create(body: CreateStatDto, request: RequestWithCharacterId = null) {
    const { name } = body;

    const characterId = body.characterId || request.character._id;

    const isStat = isStatName(name);
    if (!isStat) {
      throw new Error('Stat name is not valid');
    }

    const newStat = {
      characterId,
      name,
    };
    const createdStat = await this.statRepository.createStat(newStat);

    return createdStat.readOnlyData;
  }

  findAll() {
    return `This action returns all stat`;
  }

  findOne(id: number) {
    return `This action returns a #${id} stat`;
  }

  categorizeStats(body: CategorizeDto) {
    if (body.category === TodoCategory.Other) {
      // chatGpt를 통해 stat을 분류하는 코드를 여기에 작성합니다.
      // 예: const stat = chatGpt.classify(body);
      // return stat;
    }
    switch (body.category) {
      case TodoCategory.Study:
        return [AllStat.Intelligence];
      case TodoCategory.Exercise:
        return [AllStat.Strength, AllStat.Agility];
      case TodoCategory.Health:
        return [AllStat.Health, AllStat.Agility];
      default:
        throw new Error(`Category is not valid #${body.category}`);
    }
  }

  async caculateAccordingToDifficulty(
    body: CalculateDifficultyDto,
  ): Promise<number> {
    const { difficulty } = body;
    let experiencePoint;
    // chatGpt에 질문한다.
    // 만약 질문이 안된다면 아래 로직을 실행한다.
    let min, max;
    switch (difficulty) {
      case 0:
        min = 1;
        max = 10;
        break;
      case 1:
        min = 8;
        max = 15;
        break;
      case 2:
        min = 13;
        max = 20;
        break;
      default:
        throw new Error(`Difficulty is not valid #${difficulty}`);
    }
    experiencePoint = Math.floor(Math.random() * (max - min + 1) + min);

    return experiencePoint;
  }

  async awardBonusForDaily(completedToDo: ToDo): Promise<number> {
    const recentTodo = await this.toDoRepository.findRecentCompletedTodo();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    let continueValue = 0;

    if (recentTodo && typeof recentTodo.continue === 'number') {
      if (new Date(recentTodo.completedDate) >= today) {
        continueValue = recentTodo.continue;
      } else if (
        new Date(recentTodo.completedDate) < today &&
        new Date(recentTodo.completedDate) >= yesterday
      ) {
        continueValue = recentTodo.continue + 1;
      }
    }

    await this.toDoRepository.updateTodoContinue(completedToDo, continueValue);

    return continueValue >= 3 ? Math.min(continueValue, 10) : 0;
  }

  update(id: number, updateStatDto: UpdateStatDto) {
    return `This action updates a #${id} statd`;
  }

  remove(id: number) {
    return `This action removes a #${id} stat`;
  }
}
