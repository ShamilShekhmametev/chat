import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { CMD_MESSAGES } from 'src/helpers/constants';
import { CreatorChat } from '../guards/creator.decorator';
import { OwnerOrAdmin } from '../guards/ownerOrAdmin.decorator';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  create(@Body() createChatDto: CreateChatDto) {
    return this.chatService.create(createChatDto);
  }

  @MessagePattern(CMD_MESSAGES.GET_CHATS)
  @Get(':id')
  async findAllByUserId(userId: string) {
    return await this.chatService.findAllByUserId(userId);
  }

  @MessagePattern(CMD_MESSAGES.GET_ALL_USERS)
  async findAllUsersByChatId(chatId: string) {
    return await this.chatService.findAllUsersByChatId(chatId);
  }

  @MessagePattern(CMD_MESSAGES.GET_OWNER_CHAT)
  getOwnerChat(userId: string) {
    return this.chatService.getOwnerChat(userId);
  }

  @CreatorChat()
  @Post(':chatId/admin/:userId')
  async addAdmin(
    @Param('chatId') chatId: string,
    @Param('userId') userId: string,
  ) {
    return await this.chatService.addAdmin(chatId, userId);
  }

  @CreatorChat()
  @Delete(':chatId/admin/:userId')
  async removeAdmin(
    @Param('chatId') chatId: string,
    @Param('userId') userId: string,
  ) {
    return await this.chatService.removeAdmin(chatId, userId);
  }

  @OwnerOrAdmin()
  @Post(':chatId/participants/:userId')
  async addUser(
    @Param('chatId') chatId: string,
    @Param('userId') userId: string,
  ) {
    return await this.chatService.addUser(chatId, userId);
  }

  @OwnerOrAdmin()
  @Delete(':chatId/participants/:userId')
  async removeUser(
    @Param('chatId') chatId: string,
    @Param('userId') userId: string,
  ) {
    return await this.chatService.removeUser(chatId, userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChatDto: UpdateChatDto) {
    return this.chatService.update(id, updateChatDto);
  }

  @CreatorChat()
  @Delete(':chatId')
  remove(@Param('chatId') chatId: string) {
    return this.chatService.remove(chatId);
  }
}
