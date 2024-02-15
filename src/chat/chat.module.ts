import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MessageDBModule } from '../message/message.db';
import { ChatDBModule } from './chat.db';
import { RedisModule } from '../redis.module';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { ChatCreatorGuard } from '../guards/creator.guard';

@Module({
  imports: [RedisModule, ChatDBModule],
  controllers: [ChatController],
  providers: [ChatService, ConfigService, JwtService],
})
export class ChatModule {}
