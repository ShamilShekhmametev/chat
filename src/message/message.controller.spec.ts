import { Test, TestingModule } from '@nestjs/testing';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { RedisModule } from '../redis.module';
import { MessageDBModule } from './message.db';
import {
  TIME,
  createDefaultMessage,
  createDefaultMessageMassive,
  createMessageForUpdate,
  messageId,
} from './helpers/message.fixture';
import { Message } from './message.schema';
import { JwtService } from '@nestjs/jwt';

describe('MessageController', () => {
  let controller: MessageController;
  let service: MessageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [RedisModule, MessageDBModule],
      controllers: [MessageController],
      providers: [MessageService, JwtService],
    }).compile();

    controller = module.get<MessageController>(MessageController);
    service = module.get<MessageService>(MessageService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be update message', async () => {
    const message = createDefaultMessage() as Message;
    const messageInfo = createMessageForUpdate();
    jest.spyOn(service, 'update').mockImplementation(async () => message);
    const updatedMessage = await controller.update(messageId, messageInfo);

    expect(updatedMessage).toBe(message);
  });

  it('should be delete message', async () => {
    const message = createDefaultMessage() as Message;
    jest.spyOn(service, 'remove').mockImplementation(async () => message);
    const removedMessage = await controller.remove(messageId);

    expect(removedMessage).toBe(message);
  });

  it('should be get messages on time', async () => {
    const chatId = 'chatId';
    const messages = createDefaultMessageMassive() as Message[];
    jest.spyOn(service, 'findByTime').mockImplementation(async () => messages);
    const foundMessages = await controller.findByTime(chatId, TIME.TODAY);

    expect(foundMessages).toBe(messages);
  });
});
