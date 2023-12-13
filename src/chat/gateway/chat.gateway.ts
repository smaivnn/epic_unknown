import { Logger } from '@nestjs/common';
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { ChatService } from '../service/chat.service';
import { CreateChatDto } from '../dto/create-chat.dto';
import { UpdateChatDto } from '../dto/update-chat.dto';
import { Server, Socket } from 'socket.io';
import { SocketStateService } from 'src/websocket/socketStateServcie';

@WebSocketGateway({ namespace: 'chat', cors: { origin: '*' } })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger = new Logger('Chat');
  private namespace: string = 'chat';

  constructor(
    private readonly chatService: ChatService,
    private readonly socketStateService: SocketStateService,
  ) {}

  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    this.logger.log('friend gateway init');
  }

  handleConnection(@ConnectedSocket() socket: Socket) {
    const characterId =
      this.socketStateService.getcharacterIdFromSocket(socket);
    this.socketStateService.connect(characterId, this.namespace, socket.id);
    this.logger.log(`connected: ${socket.id} ${socket.nsp.name}`);
  }

  handleDisconnect(client: Socket) {
    const characterId =
      this.socketStateService.getcharacterIdFromSocket(client);
    this.socketStateService.disconnect(characterId, this.namespace);
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('createChat')
  create(@MessageBody() createChatDto: CreateChatDto) {
    return this.chatService.create(createChatDto);
  }

  @SubscribeMessage('findAllChat')
  findAll() {
    return this.chatService.findAll();
  }

  @SubscribeMessage('findOneChat')
  findOne(@MessageBody() id: number) {
    return this.chatService.findOne(id);
  }

  @SubscribeMessage('updateChat')
  update(@MessageBody() updateChatDto: UpdateChatDto) {
    return this.chatService.update(updateChatDto.id, updateChatDto);
  }

  @SubscribeMessage('removeChat')
  remove(@MessageBody() id: number) {
    return this.chatService.remove(id);
  }
}
