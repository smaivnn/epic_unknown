import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty, IsString, IsMongoId } from 'class-validator';
import { Document, SchemaOptions, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

const options: SchemaOptions = {
  timestamps: true,
};

@Schema(options)
export class Friend extends Document {
  @ApiProperty({
    example: '65093e80519b02894abaed4e',
    description: 'characterId',
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
    example: '65093e80519b02894abaed4e',
    description: 'characterId',
    required: true,
  })
  @Prop({
    type: Types.ObjectId,
    ref: 'Character',
    required: true,
  })
  @IsMongoId()
  @IsNotEmpty()
  friendId: Types.ObjectId;

  @ApiProperty({
    example: 'This is a comment.',
    description: 'Comment content',
    required: true,
  })
  @Prop({
    type: String,
    enum: ['pending', 'accepted', 'declined', 'blocked'],
    default: 'pending',
  })
  @IsString()
  @IsNotEmpty()
  status: string;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;

  readonly readOnlyData: {
    _id: Types.ObjectId;
    characterId: Types.ObjectId;
    friendId: Types.ObjectId;
    status: string;
    createdAt: Date;
    updatedAt: Date;
  };
}

const _FriendSchema = SchemaFactory.createForClass(Friend);

_FriendSchema.virtual('readOnlyData').get(function (this: Friend) {
  return {
    _id: this.id,
    characterId: this.characterId,
    friendId: this.friendId,
    status: this.status,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
});

_FriendSchema.set('toObject', { virtuals: true });
_FriendSchema.set('toJSON', { virtuals: true });

export const FriendSchema = _FriendSchema;
