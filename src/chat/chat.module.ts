import { Module } from '@nestjs/common';
import { ChatService } from './service/chat.service';
import { ChatGateway } from './gateway/chat.gateway';
import { Chat, ChatSchema } from './database/chat.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { SocketStateModule } from 'src/websocket/socketState.module';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
    SocketStateModule,
  ],
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}
