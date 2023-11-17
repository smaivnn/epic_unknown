import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty, IsString, IsMongoId } from 'class-validator';
import { Document, SchemaOptions, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

const options: SchemaOptions = {
  timestamps: true,
};

@Schema(options)
export class Character extends Document {
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
    example: 'tokkigondue',
    description: 'Character name',
    required: true,
  })
  @Prop({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: ['34213e80237d05494abgfd4g'],
    description: 'Array of statIds',
    required: true,
  })
  @Prop({
    type: [{ type: Types.ObjectId, ref: 'Stat' }],
    required: true,
  })
  @IsMongoId()
  @IsNotEmpty()
  stats: Types.ObjectId[];

  readonly readOnlyData: {
    _id: string;
  };
}

const _CharacterSchema = SchemaFactory.createForClass(Character);

_CharacterSchema.virtual('readOnlyData').get(function (this: Character) {
  return {
    _id: this.id,
  };
});

_CharacterSchema.set('toObject', { virtuals: true });
_CharacterSchema.set('toJSON', { virtuals: true });

export const CharacterSchema = _CharacterSchema;
