import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ToDo } from './to-do.schema';
import { CreateToDoDto } from '../dto/create-to-do.dto';

@Injectable()
export class ToDoRepository {
  constructor(
    @InjectModel(ToDo.name) private readonly todoModel: Model<ToDo>,
  ) {}

  async createToDo(todo: CreateToDoDto, user): Promise<ToDo> {
    const userId = user._id;

    // 0. isDeleted가 false이고 status가 false이며 priority가 3인 항목이 있는지 확인한다.
    const foundToDoWithPriority3 = await this.todoModel
      .findOne({ userId, isDeleted: false, status: false, priority: 3 })
      .exec();

    // 1. 만약 있다면 갯수 제한인 3개를 초과하여 생성하고자 하는 것이므로 에러를 발생시킨다.
    if (foundToDoWithPriority3) {
      throw new Error('ToDo 항목은 3개까지만 생성할 수 있습니다.');
    }

    // 2. 만약 없다면 현재 isDeleted가 false이고 status가 false인 항목중에서 priority가 가장 큰 것의 +1을 하여 새로운 toDo항목을 생성한다.
    const maxPriorityToDo = await this.todoModel
      .find({ userId, isDeleted: false, status: false })
      .sort('-priority')
      .limit(1)
      .exec();

    const newPriority =
      maxPriorityToDo.length > 0 ? maxPriorityToDo[0].priority + 1 : 1;
    const newToDo = {
      ...todo,
      userId,
      priority: newPriority,
    };
    const createdToDo = await this.todoModel.create(newToDo);

    return createdToDo;
  }

  async findAllToDo(user): Promise<ToDo[]> {
    const userId = user._id;
    const allToDo = await this.todoModel
      .find({ userId, isDeleted: false })
      .sort({ priority: 1 })
      .exec();

    return allToDo;
  }

  async updateToDo(todo, todoId): Promise<ToDo> {
    const updatedToDo = await this.todoModel
      .findOneAndUpdate({ _id: todoId }, todo, { new: true })
      .exec();

    return updatedToDo;
  }

  async decreasePriority(toDo, todoId, userId) {
    const toDoPriority = toDo.priority;

    // 다른 ToDo 중에서 isDeleted가 false이고 status가 false인 항목을 찾고, priority를 감소시킴
    await this.todoModel
      .updateMany(
        {
          _id: { $ne: todoId }, // 현재 삭제된 ToDo는 제외
          userId,
          isDeleted: false,
          status: false,
          priority: { $gt: toDoPriority },
        },
        { $inc: { priority: -1 } }, // priority를 1씩 감소시킴
      )
      .exec();
  }

  async removeToDo(todoId, user): Promise<ToDo> {
    const userId = user._id;
    const removedToDo = await this.todoModel
      .findOneAndUpdate(
        {
          _id: todoId,
          userId,
        },
        {
          isDeleted: true,
          priority: 0,
        },
      )
      .exec();

    if (removedToDo.status === false) {
      this.decreasePriority(removedToDo, todoId, userId);
    }

    return removedToDo;
  }

  async completeToDo(todoId, user): Promise<ToDo> {
    const userId = user._id;
    const completeToDo = await this.todoModel
      .findOneAndUpdate(
        {
          _id: todoId,
          userId,
        },
        {
          status: true,
          priority: 0,
          completedDate: new Date().toISOString(),
        },
      )
      .exec();

    if (completeToDo) {
      this.decreasePriority(completeToDo, todoId, userId);
    }

    return completeToDo;
  }

  async changeToDoPriority(todos, user): Promise<ToDo[]> {
    const changedPriorityToDo = await Promise.all(
      todos.map(async (todo, index) => {
        const changedToDo = await this.todoModel
          .findOneAndUpdate(
            {
              _id: todo,
              userId: user._id,
            },
            {
              priority: index + 1,
            },
            { new: true },
          )
          .exec();
        return changedToDo;
      }),
    );

    return changedPriorityToDo;
  }

  async findRecentCompletedTodo(): Promise<ToDo> {
    const recentTodo = await this.todoModel
      .find()
      .sort({ completedDate: -1 })
      .limit(2)
      .exec();
    if (recentTodo.length < 2) {
      return null;
    }
    return recentTodo[1];
  }

  async updateTodoContinue(completedToDo: ToDo, continueCount: number) {
    const updatedToDo = await this.todoModel
      .findOneAndUpdate(
        {
          _id: completedToDo._id,
        },
        {
          continue: continueCount,
        },
        { new: true },
      )
      .exec();
    return updatedToDo;
  }
}
