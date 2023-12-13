import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketStateService } from 'src/websocket/socketStateServcie';
import { FriendService } from '../service/friend.service';
import { Types } from 'mongoose';

@WebSocketGateway({ namespace: 'friend', cors: { origin: '*' } })
export class FriendGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger = new Logger('Friend');
  private namespace: string = 'friend';

  constructor(
    private readonly socketStateService: SocketStateService,
    private readonly friendService: FriendService,
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

  // 친구 요청
  @SubscribeMessage('friend-request')
  async handleFriendRequest(
    @MessageBody() data: { senderId: string; receiverId: string },
    @ConnectedSocket() socket: Socket,
  ) {
    // 이미 요청했는지 확인
    const isAbleToRequest = await this.friendService.checkIsAbleToRequestFriend(
      new Types.ObjectId(data.senderId),
      new Types.ObjectId(data.receiverId),
    );
    if (isAbleToRequest) {
      throw new Error('이미 친구 요청을 보냈습니다.');
    }

    // 새로운 친구 요청 저장
    const newFriendRequest = await this.friendService.create({
      characterId: new Types.ObjectId(data.senderId),
      friendId: new Types.ObjectId(data.receiverId),
    });
    // 수신자가 접속중인지 확인
    const receiverSocketId = this.socketStateService.getSocketId(
      data.receiverId,
      this.namespace,
    );
    // 접속중이라면 수신자에게 친구 요청 전송
    if (receiverSocketId) {
      this.server.to(receiverSocketId).emit('friend-request', data);
    }
  }

  // 친구 요청 수락
  // 친구 목록에서 수락/거절을 누르면 발생한다.
  @SubscribeMessage('friend-accept')
  async handleFriendAccept(
    @MessageBody() id: string | Types.ObjectId,
    @ConnectedSocket() socket: Socket,
  ) {
    // ID를 기준으로 친구 요청을 찾는다.
    const friendRequest = await this.friendService.findOneById(id);
    if (!friendRequest) {
      throw new Error('친구 요청을 찾을 수 없습니다.');
    }
    // 해당하는 친구 요청의 상태를 수락으로 변경한다
    const updatedFriendRequest = await this.friendService.update(id, {
      status: 'accepted',
    });

    // 친구 요청을 보낸 사람의 소켓 ID를 가져온다.
    const senderSocketId = this.socketStateService.getSocketId(
      updatedFriendRequest.characterId.toString(),
      this.namespace,
    );

    // 친구 요청을 보낸 사람의 소켓 ID가 존재한다면
    if (senderSocketId) {
      // 친구 요청을 보낸 사람에게 친구 요청 수락을 전송한다.
      this.server
        .to(senderSocketId)
        .emit('friend-accept', updatedFriendRequest.friendId);
    }
  }

  @SubscribeMessage('friend-declined')
  async handleFriendDeclined(
    @MessageBody() id: string | Types.ObjectId,
    @ConnectedSocket() socket: Socket,
  ) {
    // ID를 기준으로 친구 요청을 찾는다.
    const friendRequest = await this.friendService.findOneById(id);
    if (!friendRequest) {
      throw new Error('친구 요청을 찾을 수 없습니다.');
    }
    // 해당하는 친구 요청의 상태를 거절으로 변경한다
    const updatedFriendRequest = await this.friendService.update(id, {
      status: 'declined',
    });

    // 추후 시간초 적용 등과 같은 로직이 필요하다면 작성한다
  }

  @SubscribeMessage('friend-list')
  async handleFriendList(
    @MessageBody() characterId: string | Types.ObjectId,
    @ConnectedSocket() socket: Socket,
  ) {
    // 친구 목록을 가져온다.
    const [friendList, friendRequestList] = await Promise.all([
      this.friendService.findAllByCharacterId(characterId),
      this.friendService.findFriendRequestByCharacterId(characterId),
    ]);

    const response = {
      friendList,
      friendRequestList,
    };

    this.server.to(socket.id).emit('friend-list', response);
  }

  @SubscribeMessage('friend-delete')
  async handleFriendDelete(
    @MessageBody() data: { myId: string; deleteId: string },
    @ConnectedSocket() socket: Socket,
  ) {
    const friendList = await this.friendService.findAllByCharacterId(data.myId);

    if (
      friendList.find(
        (friend) => friend._id.toString() === data.deleteId.toString(),
      )
    ) {
      await this.friendService.remove(data.myId, data.deleteId);
    }
  }
}
