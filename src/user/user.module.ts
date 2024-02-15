import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UserDBModule } from './user.db';
import { RedisModule } from '../redis.module';

@Module({
  imports: [RedisModule, UserDBModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
