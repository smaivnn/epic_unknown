import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty, IsString, IsMongoId, IsArray } from 'class-validator';
import { Document, SchemaOptions, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

const options: SchemaOptions = {
  timestamps: true,
};

@Schema(options)
export class Post extends Document {
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
    example: 'free',
    description: '게시판 이름',
    required: true,
  })
  @Prop({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  board: string;

  @ApiProperty({
    example: 'Post Title',
    description: 'Post title',
    required: true,
  })
  @Prop({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'Post content',
    description: 'Post content',
    required: true,
  })
  @Prop({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    example: 'quest',
    description: '게시글 주제',
    required: true,
  })
  @Prop({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  category: string;

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
    example: ['http://example.com/image1.jpg', 'http://example.com/image2.jpg'],
    description: 'Array of image URLs',
  })
  @Prop({
    type: [String],
    required: false, // if the images are not mandatory
  })
  @IsArray()
  @IsString({ each: true })
  imageUrls: string[];

  @ApiProperty({
    example: ['34213e80237d05494abgfd4g'],
    description: 'Array of Comment IDs',
    required: true,
  })
  @Prop({
    type: [{ type: Types.ObjectId, ref: 'Comment' }],
    default: [],
  })
  @IsMongoId({ each: true })
  comments: Types.ObjectId[];

  @ApiProperty({
    example: 0,
    description: 'The number of views of the post',
    default: 0,
  })
  @Prop({
    type: Number,
    default: 0,
  })
  views: number;

  @ApiProperty({
    example: 0,
    description: 'The number of upvotes of the post',
    default: 0,
  })
  @Prop({
    type: Number,
    default: 0,
  })
  upvotes: number;

  @ApiProperty({
    example: false,
    description: 'Indicates whether the post is deleted',
    default: false,
  })
  @Prop({
    type: Boolean,
    default: false,
  })
  isDeleted: boolean;

  readonly createdAt: Date;
  readonly updatedAt: Date;

  readonly readOnlyDataForList: {
    userId: Types.ObjectId;
    _id: Types.ObjectId;
    board: string;
    category: string;
    author: string;
    imageUrls: string[];
    comments: Types.ObjectId[];
    views: number;
    upvotes: number;
  };

  readonly readOnlyDataForSinglePost: {
    userId: Types.ObjectId;
    _id: Types.ObjectId;
    title: string;
    content: string;
    category: string;
    author: string;
    imageUrls: string[];
    comments: Types.ObjectId[];
    views: number;
    upvotes: number;
  };
}

const _PostSchema = SchemaFactory.createForClass(Post);

_PostSchema.virtual('readOnlyDataForList').get(function (this: Post) {
  return {
    _id: this.id,
    userId: this.userId,
    board: this.board,
    category: this.category,
    author: this.author,
    imageUrls: this.imageUrls,
    comments: this.comments,
    views: this.views,
    upvotes: this.upvotes,
  };
});

_PostSchema.virtual('readOnlyDataForSinglePost').get(function (this: Post) {
  return {
    _id: this.id,
    userId: this.userId,
    title: this.title,
    content: this.content,
    category: this.category,
    author: this.author,
    imageUrls: this.imageUrls,
    comments: this.comments,
    views: this.views,
    upvotes: this.upvotes,
  };
});

_PostSchema.set('toObject', { virtuals: true });
_PostSchema.set('toJSON', { virtuals: true });

export const PostSchema = _PostSchema;
