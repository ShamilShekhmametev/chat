import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { CreatePollingDto } from './dto/create-polling.dto';
import { UpdatePollingDto } from './dto/update-polling.dto';
import { REDIS_SERVICE } from '../redis.module';
import { ClientProxy } from '@nestjs/microservices';
import { CreateMessageDto } from '../message/dto/create-message.dto';
import { Message } from '../message/message.schema';
import { Server } from 'socket.io';
import { Subject, lastValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { AuthSocket, JwtPayload } from './helpers/auth.class';
import { Seen } from './helpers/seen.type';
import { checkUserChatMembership } from './helpers/checkUserChatMembership';
import { CMD_MESSAGES, EVENTS } from 'src/helpers/constants';

@Injectable()
export class PollingService {
  constructor(
    @Inject(REDIS_SERVICE) private client: ClientProxy,
    private configService: ConfigService,
  ) {}

  private gatewayEvents = new Subject<{ event: string; data: any }>();

  handleMessage(chats: string[], message: CreateMessageDto) {
    const isUserHaveAccess = checkUserChatMembership(chats, message.chat);

    if (!isUserHaveAccess) {
      throw new ForbiddenException();
    }

    this.client.emit(EVENTS.MESSAGE_ARRIVED, message);
  }

  handleSeen(chats: string[], data: Seen) {
    const isUserHaveAccess = checkUserChatMembership(chats, data.chatId);

    if (!isUserHaveAccess) {
      throw new ForbiddenException();
    }

    this.client.emit(EVENTS.SEEN_ARRIVED, data.messageId);
  }

  handleConnection(token: string) {
    const secret = this.configService.get<string>('JWT_SECRET')!;
    const payload = jwt.verify(token, secret) as JwtPayload;

    return payload;
  }

  async getUserChats(userId: string) {
    const userChatsRequest = this.client.send(CMD_MESSAGES.GET_CHATS, userId);
    return await lastValueFrom(userChatsRequest);
  }

  getEvents() {
    return this.gatewayEvents;
  }

  sendMessage(msg: Message) {
    this.gatewayEvents.next({ event: EVENTS.MESSAGE, data: msg });
  }
}
