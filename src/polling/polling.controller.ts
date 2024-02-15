import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PollingService } from './polling.service';
import { CreatePollingDto } from './dto/create-polling.dto';
import { UpdatePollingDto } from './dto/update-polling.dto';
import { CreateMessageDto } from '../message/dto/create-message.dto';
import { EventPattern } from '@nestjs/microservices';
import { Message } from 'src/message/message.schema';
import { EVENTS } from 'src/helpers/constants';

@Controller('polling')
export class PollingController {
  constructor(private readonly pollingService: PollingService) {}

  @EventPattern(EVENTS.MESSAGE_HANDLED)
  sendMessage(message: Message) {
    this.pollingService.sendMessage(message);
  }
}
