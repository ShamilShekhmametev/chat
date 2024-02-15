import { Module } from '@nestjs/common';
import { PollingService } from './polling.service';
import { PollingController } from './polling.controller';
import { RedisModule } from '../redis.module';
import { PollingGateway } from './polling.gateway';

@Module({
  imports: [RedisModule],
  controllers: [PollingController],
  providers: [PollingService, PollingGateway],
})
export class PollingModule {}
