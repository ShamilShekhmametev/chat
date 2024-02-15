import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MessageDBModule } from './message.db';
import { RedisModule } from '../redis.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [RedisModule, MessageDBModule],
  controllers: [MessageController],
  providers: [MessageService, JwtService],
})
export class MessageModule {}
