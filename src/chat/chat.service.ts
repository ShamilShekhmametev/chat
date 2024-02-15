import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { InjectConnection } from '@nestjs/mongoose';
import mongoose, { Connection } from 'mongoose';
import { REDIS_SERVICE } from '../redis.module';
import { ClientProxy } from '@nestjs/microservices';
import { Chat, ChatDocument } from './chat.schema';
import { userId } from 'src/user/helpers/user.fixture';

@Injectable()
export class ChatService {
  private readonly chatModel;
  constructor(
    @InjectConnection('chats') private connection: Connection,
    @Inject(REDIS_SERVICE) private client: ClientProxy,
  ) {
    this.chatModel = this.connection.model<ChatDocument>(Chat.name);
  }

  async create(createChatDto: CreateChatDto): Promise<Chat> {
    const createdChat = new this.chatModel(createChatDto);
    return createdChat.save();
  }

  async addUser(chatId: string, userId: string) {
    return await this.chatModel.findByIdAndUpdate(
      chatId,
      { $addToSet: { participants: userId } },
      { new: true },
    );
  }

  async addAdmin(chatId: string, userId: string) {
    return await this.chatModel.findByIdAndUpdate(
      chatId,
      { $addToSet: { admins: userId } },
      { new: true },
    );
  }

  async removeAdmin(chatId: string, userId: string) {
    return await this.chatModel.findByIdAndUpdate(
      chatId,
      { $pull: { admins: userId } },
      { new: true },
    );
  }

  async checkChatsAdmin(chatId: string, userId: string) {
    const chat = await this.chatModel
      .findOne({ _id: chatId, admins: { $in: [userId] } })
      .exec();
    return chat !== null;
  }

  async removeUser(chatId: string, userId: string) {
    return await this.chatModel.findByIdAndUpdate(
      chatId,
      { $pull: { participants: userId } },
      { new: true },
    );
  }

  async findAllUsersByChatId(chatId: string) {
    const users = await this.chatModel.find(
      { _id: chatId },
      { participants: 1 },
    );
    return users[0].participants;
  }

  async findAllByUserId(userId: string) {
    return await this.chatModel
      .find({ participants: { $in: [userId] } }, { _id: 1 })
      .distinct('_id')
      .exec();
  }

  async getOwnerChat(userId: string) {
    const chat = await this.chatModel.findOne({ createdBy: userId }).exec();

    if (!chat) {
      throw new NotFoundException();
    }

    return chat.createdBy;
  }

  async findOne(id: string) {
    const chat = await this.chatModel.findById(id);
    if (!chat) {
      throw new NotFoundException();
    }
    return chat;
  }

  async update(id: string, updateChatDto: UpdateChatDto) {
    return await this.chatModel.findByIdAndUpdate(id, updateChatDto, {
      new: true,
    });
  }

  async remove(id: string) {
    return await this.chatModel.findByIdAndDelete(id);
  }
}
