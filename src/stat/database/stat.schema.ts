import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty, IsString, IsNumber, IsMongoId } from 'class-validator';
import { Document, SchemaOptions, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { experiencePerLevel, level } from 'src/constants/level';

const options: SchemaOptions = {
  timestamps: true,
};

@Schema(options)
export class Stat extends Document {
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
    example: 'strength',
    description: 'ability name',
    required: true,
  })
  @Prop({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: '3,000',
    description: 'current experience',
    required: true,
  })
  @Prop({
    default: 0,
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  currentExperience: number;

  @ApiProperty({
    example: '5',
    description: 'current level',
    required: true,
  })
  @Prop({
    default: 1,
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  level: number;

  @ApiProperty({
    example: '1500',
    description: 'experience to level up 남은 경험치',
    required: true,
  })
  @Prop({
    default: experiencePerLevel.level1,
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  experienceToLevelUp: number;

  @ApiProperty({
    example: '50',
    description: 'maximum level',
    required: true,
  })
  @Prop({
    default: level.maxLevel,
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  maximumLevel: number;

  readonly readOnlyData: {
    _id: Types.ObjectId;
    characterId: Types.ObjectId;
    name: string;
    currentExperience: number;
    level: number;
    experienceToLevelUp: number;
    maximumLevel: number;
  };
}

const _StatSchema = SchemaFactory.createForClass(Stat);

_StatSchema.virtual('readOnlyData').get(function (this: Stat) {
  return {
    _id: this.id,
    characterId: this.characterId,
    name: this.name,
    currentExperience: this.currentExperience,
    level: this.level,
    experienceToLevelUp: this.experienceToLevelUp,
    maximumLevel: this.maximumLevel,
  };
});

_StatSchema.set('toObject', { virtuals: true });
_StatSchema.set('toJSON', { virtuals: true });

export const StatSchema = _StatSchema;
