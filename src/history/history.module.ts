import { Module } from '@nestjs/common';
import { HistoryService } from './service/history.service';
import { HistoryController } from './controller/history.controller';

@Module({
  controllers: [HistoryController],
  providers: [HistoryService],
})
export class HistoryModule {}
