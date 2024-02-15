import { Test, TestingModule } from '@nestjs/testing';
import { PollingService } from './polling.service';
import { ClientProxy } from '@nestjs/microservices';
import { RedisModule } from '../redis.module';
import { createDefaultMessage } from '../message/helpers/message.fixture';

describe('PollingService', () => {
  let service: PollingService;
  let client: ClientProxy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [RedisModule],
      providers: [PollingService],
    }).compile();

    service = module.get<PollingService>(PollingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
