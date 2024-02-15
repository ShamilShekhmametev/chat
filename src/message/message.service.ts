import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { Message, MessageDocument } from './message.schema';
import { REDIS_SERVICE } from '../redis.module';
import { ClientProxy } from '@nestjs/microservices';
import { CMD_MESSAGES, EVENTS } from '../helpers/constants';
import { lastValueFrom } from 'rxjs';
import { TIME } from './helpers/message.fixture';

@Injectable()
export class MessageService {
  private readonly messageModel;
  constructor(
    @InjectConnection('messages') private connection: Connection,
    @Inject(REDIS_SERVICE) private client: ClientProxy,
  ) {
    this.messageModel = this.connection.model<MessageDocument>(Message.name);
  }

  async create(createMessageDto: CreateMessageDto): Promise<Message> {
    const createdMessage = new this.messageModel(createMessageDto);
    return createdMessage.save();
  }

  sendMessage(message: Message) {
    this.client.emit(EVENTS.MESSAGE_HANDLED, message);
  }

  async getUsersOfChat(chatId: string) {
    const requestChat = this.client.send(CMD_MESSAGES.GET_ALL_USERS, chatId);
    const users = await lastValueFrom(requestChat);
    return users;
  }

  async findByTime(chatId: string, time: string) {
    const message = this.messageModel.find({ chat: chatId });
    const date = new Date(Date.now());

    if (time === TIME.TODAY) {
      const timeToday = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() - 1,
        3,
        0,
        0,
      ).getTime();

      message.where('createdAt').gte(timeToday);
    }
    if (time === TIME.WEEK) {
      const timeWeek = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() - 7,
        3,
        0,
        0,
      ).getTime();

      message.where('createdAt').gte(timeWeek);
    }
    message.sort({ createdAt: 1 });

    return (await message.exec()) as Message[];
  }

  async findOne(id: string) {
    const message = await this.messageModel.findById(id);
    if (!message) {
      throw new NotFoundException();
    }
    return message;
  }

  async update(
    id: string,
    updateMessageDto: UpdateMessageDto,
  ): Promise<Message> {
    const updatedMessage = await this.messageModel.findByIdAndUpdate(
      id,
      updateMessageDto,
      { new: true },
    );

    if (!updatedMessage) {
      throw new NotFoundException();
    }

    return updatedMessage;
  }

  async remove(id: string): Promise<Message> {
    const deletedMessage = await this.messageModel.findByIdAndDelete(id);

    if (!deletedMessage) {
      throw new NotFoundException();
    }

    return deletedMessage;
  }

  async handleCreatorOfChat(userId: string) {
    const requestChat = this.client.send(CMD_MESSAGES.GET_OWNER_CHAT, userId);
    const ownerId = await lastValueFrom(requestChat);
    return ownerId;
  }
}
