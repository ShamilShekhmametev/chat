import { Test, TestingModule } from '@nestjs/testing';
import { MessageService } from './message.service';
import { MessageDBModule } from './message.db';
import { RedisModule } from '../redis.module';
import {
  TIME,
  chatId,
  createDefaultMessage,
  createMessageForUpdate,
  messageId,
} from './helpers/message.fixture';

describe('MessageService', () => {
  let service: MessageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [RedisModule, MessageDBModule],
      providers: [MessageService],
    }).compile();

    service = module.get<MessageService>(MessageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be create message', async () => {
    const message = createDefaultMessage();
    const createdMessage = await service.create(message);

    expect(createdMessage.messageFrom).toBe(message.messageFrom);
    expect(createdMessage.chat).toBe(message.chat);
    expect(createdMessage.text).toBe(message.text);
  });

  it('should be update message', async () => {
    const message = createMessageForUpdate();
    const updatedMessage = await service.update(messageId, message);

    expect(updatedMessage.text).toBe(message.text);
  });

  it('should be delete message', async () => {
    const result = await service.remove(messageId);

    expect(result).toBeDefined();
  });

  it('should be get messages on today', async () => {
    const messagesOnToday = await service.findByTime(chatId, TIME.TODAY);
    const timeOfLastMsg = messagesOnToday[0].createdAt.getTime();
    const date = new Date(Date.now());
    const timeToday = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() - 1,
      3,
      0,
      0,
    ).getTime();

    expect(timeOfLastMsg).toBeGreaterThanOrEqual(timeToday);
  });

  it('should be get messages on week', async () => {
    const messagesOnWeek = await service.findByTime(chatId, TIME.WEEK);
    const timeOfLastMsg = messagesOnWeek[0].createdAt.getTime();
    const date = new Date(Date.now());
    const timeWeek = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() - 7,
      3,
      0,
      0,
    ).getTime();

    expect(timeOfLastMsg).toBeGreaterThanOrEqual(timeWeek);
  });
});
