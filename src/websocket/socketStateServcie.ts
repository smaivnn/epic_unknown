import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class SocketStateService {
  private characterIdToSocketIdMap: {
    [characterId: string]: { [namespace: string]: string };
  } = {};

  constructor() {}
  getcharacterIdFromSocket(socket: Socket): string {
    const characterId = socket.handshake.query.characterId;
    return Array.isArray(characterId) ? characterId[0] : characterId;
  }

  connect(characterId: string, namespace: string, socketId: string) {
    if (!this.characterIdToSocketIdMap[characterId]) {
      this.characterIdToSocketIdMap[characterId] = {};
    }
    this.characterIdToSocketIdMap[characterId][namespace] = socketId;
    console.log(this.characterIdToSocketIdMap);
  }

  disconnect(characterId: string, namespace: string) {
    if (this.characterIdToSocketIdMap[characterId]) {
      delete this.characterIdToSocketIdMap[characterId][namespace];
    }
  }

  getSocketId(characterId: string, namespace: string): string | undefined {
    return this.characterIdToSocketIdMap[characterId]?.[namespace];
  }
}
