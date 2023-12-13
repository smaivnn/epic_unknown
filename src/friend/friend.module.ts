import { FriendRepository } from './database/friend.repository';
import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FriendService } from './service/friend.service';
import { FriendController } from './controller/friend.controller';
import { FriendGateway } from './gateway/friend.gateway';
import { Friend, FriendSchema } from './database/friend.schema';
import { CharacterModule } from 'src/character/character.module';
import { SocketStateModule } from 'src/websocket/socketState.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Friend.name, schema: FriendSchema }]),
    forwardRef(() => CharacterModule),
    SocketStateModule,
  ],
  controllers: [FriendController],
  providers: [FriendService, FriendGateway, FriendRepository],
})
export class FriendModule {}
