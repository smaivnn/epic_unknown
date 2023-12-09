import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { PostService } from '../service/post.service';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { JwtAuthGuard } from 'src/auth/jwt/access-auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { Post as PostModel } from '../database/post.schema';

@ApiTags('Post')
@UseGuards(JwtAuthGuard)
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  async create(@Body() body: CreatePostDto, @Req() request: Request) {
    return this.postService.create(body, request);
  }

  @Get('/user/:userId')
  async findAllByUser(@Param('userId') userId: string) {
    return this.postService.findAllByUser(userId);
  }

  @Get('/board/:boardName')
  async findAllByBoard(@Param('boardName') boardName: string) {
    return this.postService.findAllByBoard(boardName);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.postService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() body: UpdatePostDto,
    @Req() request: Request,
  ) {
    return this.postService.update(id, body, request);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() request: Request) {
    return this.postService.remove(id, request);
  }

  @Post('view/:postId')
  async viewPost(
    @Param('postId') postId: string | Types.ObjectId,
    @Req() request: Request,
  ): Promise<PostModel> {
    return this.postService.view(postId, request);
  }

  @Post('like/:postId')
  async likePost(
    @Param('postId') postId: string | Types.ObjectId,
    @Req() request: Request,
  ) {
    return this.postService.toggleLike(postId, request);
  }
}
