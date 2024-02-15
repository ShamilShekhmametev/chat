import { Test, TestingModule } from '@nestjs/testing';
import { PollingController } from './polling.controller';
import { PollingService } from './polling.service';
import { RedisModule } from '../redis.module';
import { createDefaultMessage } from 'src/message/helpers/message.fixture';

describe('PollingController', () => {
  let controller: PollingController;
  let service: PollingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [RedisModule],
      controllers: [PollingController],
      providers: [PollingService],
    }).compile();

    controller = module.get<PollingController>(PollingController);
    service = module.get<PollingService>(PollingService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
