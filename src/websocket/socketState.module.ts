// socketState.module.ts
import { Module } from '@nestjs/common';
import { SocketStateService } from './socketStateServcie';

@Module({
  providers: [SocketStateService],
  exports: [SocketStateService],
})
export class SocketStateModule {}
