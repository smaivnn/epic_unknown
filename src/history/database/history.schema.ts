import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty, IsString, IsMongoId } from 'class-validator';
import { Document, SchemaOptions, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

const options: SchemaOptions = {
  timestamps: true,
};

@Schema(options)
export class History extends Document {
  @ApiProperty({
    example: '65093e80519b02894abaed4e',
    description: 'character Id',
    required: true,
  })
  @Prop({
    type: Types.ObjectId,
    ref: 'Character',
    required: true,
  })
  @IsMongoId()
  @IsNotEmpty()
  characterId: Types.ObjectId;

  @ApiProperty({
    example: 'levelUp',
    description: 'type of history',
    required: true,
  })
  @Prop({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({
    example: 'strength',
    description: 'type of stat',
    required: true,
  })
  @Prop({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  statName: string;

  @ApiProperty({
    example: '65093e80519b02894abaed4e',
    description: 'todo Id',
    required: true,
  })
  @Prop({
    type: Types.ObjectId,
    required: true,
  })
  @IsMongoId()
  @IsNotEmpty()
  todoId: Types.ObjectId;

  readonly readOnlyData: {
    _id: string;
  };
}

const _HistorySchema = SchemaFactory.createForClass(History);

_HistorySchema.virtual('readOnlyData').get(function (this: History) {
  return {
    _id: this.id,
  };
});

_HistorySchema.set('toObject', { virtuals: true });
_HistorySchema.set('toJSON', { virtuals: true });

export const HistorySchema = _HistorySchema;
