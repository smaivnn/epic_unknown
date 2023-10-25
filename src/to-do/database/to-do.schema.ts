import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  IsNotEmpty,
  IsString,
  IsBoolean,
  IsNumber,
  IsMongoId,
} from 'class-validator';
import { Document, SchemaOptions, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

const options: SchemaOptions = {
  timestamps: true,
};

@Schema(options)
export class ToDo extends Document {
  @ApiProperty({
    example: '65093e80519b02894abaed4e',
    description: 'userId',
    required: true,
  })
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  @IsMongoId()
  @IsNotEmpty()
  userId: Types.ObjectId;

  @ApiProperty({
    example: 'ToDo title',
    description: 'title',
    required: true,
  })
  @Prop({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'ToDo content',
    description: 'content',
    required: true,
  })
  @Prop({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    example: 'true / false',
    description: 'status, true: completed, false: not completed',
  })
  @Prop({
    default: false,
    required: false,
  })
  @IsBoolean()
  status: boolean;

  @ApiProperty({
    example: '1 / 2 / 3',
    description: 'priority',
  })
  @Prop({
    default: 1,
    required: false,
  })
  @IsNumber()
  priority: number;

  @ApiProperty({
    example: '2021-08-01T00:00:00.000Z',
    description: 'dueDate',
    required: true,
  })
  @Prop({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  dueDate: string;

  @ApiProperty({
    example: 'sport',
    description: 'category',
    required: true,
  })
  @Prop({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({
    example: '2021-08-01T00:00:00.000Z',
    description: 'completedDate',
  })
  @Prop({
    required: false,
  })
  @IsString()
  completedDate: string;

  @ApiProperty({
    example: 'true / false',
    description: 'deleted, true: deleted, false: not deleted',
  })
  @Prop({
    default: false,
    required: false,
  })
  @IsBoolean()
  isDeleted: boolean;

  readonly readOnlyData: {
    _id: string;
    title: string;
    content: string;
    status: boolean;
    priority: number;
    dueDate: string;
    category: string;
    completedDate: string;
  };
}

const _ToDoSchema = SchemaFactory.createForClass(ToDo);

_ToDoSchema.virtual('readOnlyData').get(function (this: ToDo) {
  return {
    _id: this.id,
    title: this.title,
    content: this.content,
    status: this.status,
    priority: this.priority,
    dueDate: this.dueDate,
    category: this.category,
    completedDate: this.completedDate,
  };
});

_ToDoSchema.set('toObject', { virtuals: true });
_ToDoSchema.set('toJSON', { virtuals: true });

export const ToDoSchema = _ToDoSchema;
