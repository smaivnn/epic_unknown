import { Module, forwardRef } from '@nestjs/common';
import { ToDoService } from './service/to-do.service';
import { ToDoController } from './controller/to-do.controller';
import { ToDoRepository } from './database/to-do.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { ToDo, ToDoSchema } from './database/to-do.schema';
import { StatModule } from 'src/stat/stat.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ToDo.name, schema: ToDoSchema }]),
    forwardRef(() => ToDoModule),
    forwardRef(() => StatModule),
  ],
  controllers: [ToDoController],
  providers: [ToDoService, ToDoRepository],
  exports: [ToDoService, ToDoRepository],
})
export class ToDoModule {}
