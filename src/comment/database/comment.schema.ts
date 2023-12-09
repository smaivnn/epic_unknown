import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty, IsString, IsMongoId } from 'class-validator';
import { Document, SchemaOptions, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

const options: SchemaOptions = {
  timestamps: true,
};

@Schema(options)
export class Comment extends Document {
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
  author: string;

  @ApiProperty({
    example: 'This is a comment.',
    description: 'Comment content',
    required: true,
  })
  @Prop({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    example: '60cc884ef0a7bd3a641877b3',
    description: 'Post ID',
    required: true,
  })
  @Prop({
    type: Types.ObjectId,
    required: true,
  })
  @IsMongoId()
  postId: Types.ObjectId;

  @ApiProperty({
    example: false,
    description: 'Is Comment Deleted',
    default: false,
  })
  @Prop({
    type: Boolean,
    default: false,
  })
  isDeleted: boolean;

  readonly createdAt: Date;
  readonly updatedAt: Date;

  readonly readOnlyData: {
    userId: Types.ObjectId;
    _id: Types.ObjectId;
    author: string;
    content: string;
    postId: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
  };
}

const _CommentSchema = SchemaFactory.createForClass(Comment);

_CommentSchema.virtual('readOnlyData').get(function (this: Comment) {
  return {
    _id: this.id,
    userId: this.userId,
    author: this.author,
    content: this.content,
    postId: this.postId,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
});

_CommentSchema.set('toObject', { virtuals: true });
_CommentSchema.set('toJSON', { virtuals: true });

export const CommentSchema = _CommentSchema;
