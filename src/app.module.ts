import { Module, Logger } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ToDoModule } from './to-do/to-do.module';
import { CharacterModule } from './character/character.module';
import { StatModule } from './stat/stat.module';
import { HistoryModule } from './history/history.module';
import { CommentModule } from './comment/comment.module';
import { PostModule } from './post/post.module';
import { ViewModule } from './view/view.module';
import { VoteModule } from './vote/vote.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI, {
      connectionFactory: (connection) => {
        if (connection.readyState === 1) {
          Logger.log('✅ mongoDB connected...');
        }
        connection.on('disconnected', () => {
          Logger.log('🆘 mongoDB disconnected...');
        });
        return connection;
      },
    }),
    UserModule,
    AuthModule,
    ToDoModule,
    CharacterModule,
    StatModule,
    HistoryModule,
    CommentModule,
    PostModule,
    ViewModule,
    VoteModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
