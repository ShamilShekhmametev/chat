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
import { PollingService } from './polling.service';
import { AuthSocket } from './helpers/auth.class';
import { Seen } from './helpers/seen.type';
import { CLIENT_MESSAGES, EVENTS } from '../helpers/constants';

@WebSocketGateway()
export class PollingGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  constructor(private readonly pollingService: PollingService) {}

  afterInit(server: Server) {
    console.log('WebSocket Gateway initialized');
    this.pollingService.getEvents().subscribe({
      next: ({ event, data }) => {
        if (data.chat) {
          server.to(data.chat).emit(event, data);
        }
      },
    });
  }

  async handleConnection(client: AuthSocket) {
    console.log(`Client connected: ${client.id}`);
    const token = client.handshake.headers.authorization as string;

    try {
      const payload = this.pollingService.handleConnection(token);
      const chats = await this.pollingService.getUserChats(payload.userId);
      client.user = payload;
      client.chats = chats;
      client.join(chats);
    } catch (e) {
      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage(CLIENT_MESSAGES.MESSAGE)
  handleMessage(
    @ConnectedSocket() client: AuthSocket,
    @MessageBody() data: any,
  ) {
    this.pollingService.handleMessage(client.chats, data);

    //Для теста
    return {
      event: 'clientData',
      data: client.user,
    };
  }

  @SubscribeMessage(CLIENT_MESSAGES.MESSAGE_SEEN)
  handleSeen(@ConnectedSocket() client: AuthSocket, @MessageBody() data: Seen) {
    this.pollingService.handleSeen(client.chats, data);
  }

  @SubscribeMessage(CLIENT_MESSAGES.PING)
  handlePing() {
    return {
      event: EVENTS.PONG,
      data: 'pong data',
    };
  }
}
