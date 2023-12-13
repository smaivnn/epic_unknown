import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty, IsString, IsMongoId } from 'class-validator';
import { Document, SchemaOptions, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

const options: SchemaOptions = {
  timestamps: true,
};

@Schema(options)
export class Chat extends Document {
  @ApiProperty({
    example: '65093e80519b02894abaed4e',
    description: 'message senderId',
    required: true,
  })
  @Prop({
    type: Types.ObjectId,
    ref: 'Character',
    required: true,
  })
  @IsMongoId()
  @IsNotEmpty()
  senderId: Types.ObjectId;

  @ApiProperty({
    example: '65093e80519b02894abaed4e',
    description: 'message receiverId',
    required: true,
  })
  @Prop({
    type: Types.ObjectId,
    ref: 'Character',
    required: true,
  })
  @IsMongoId()
  @IsNotEmpty()
  receiverId: Types.ObjectId;

  @ApiProperty({
    example: 'This is a message',
    description: 'Message content',
    required: true,
  })
  @Prop({
    type: String,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({
    example: false,
    description: 'Message read status',
    required: true,
  })
  @Prop({
    type: Boolean,
    default: false,
  })
  read: boolean;

  @ApiProperty({
    example: '65093e80519b02894abaed4e',
    description: 'Message replyTo',
  })
  @Prop({
    type: Types.ObjectId,
    ref: 'Chat',
  })
  @IsMongoId()
  replyTo: Types.ObjectId;

  @ApiProperty({
    example: false,
    description: 'Message deleted status',
    required: true,
  })
  @Prop({
    type: Boolean,
    default: false,
  })
  deleted: boolean;
}

const _ChatSchema = SchemaFactory.createForClass(Chat);

_ChatSchema.virtual('readOnlyData').get(function (this: Chat) {
  return {
    _id: this.id,
  };
});

_ChatSchema.set('toObject', { virtuals: true });
_ChatSchema.set('toJSON', { virtuals: true });

export const ChatSchema = _ChatSchema;
