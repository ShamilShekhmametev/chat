import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { EVENTS } from '../helpers/constants';
import { CreatorOrOwnerChat } from '../guards/creatorMessOrOwnerChat.decorator';
import { Participants } from '../guards/participants.decorator';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @EventPattern(EVENTS.MESSAGE_ARRIVED)
  async handleMessageCreate(createMessageDto: CreateMessageDto) {
    const message = await this.messageService.create(createMessageDto);
    this.messageService.sendMessage(message);
  }

  @EventPattern(EVENTS.SEEN_ARRIVED)
  async handleMessageSeen(messageId: string) {
    const message = await this.messageService.update(messageId, { seen: true });
    this.messageService.sendMessage(message);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.messageService.findOne(id);
  }

  @Participants()
  @Get(':time/chat/:chatId')
  async findByTime(
    @Param('time') time: string,
    @Param('chatId') chatId: string,
  ) {
    return await this.messageService.findByTime(chatId, time);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMessageDto: UpdateMessageDto) {
    return this.messageService.update(id, updateMessageDto);
  }

  @CreatorOrOwnerChat()
  @Delete(':messageId')
  remove(@Param('messageId') messageId: string) {
    return this.messageService.remove(messageId);
  }
}
