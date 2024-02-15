import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { chatId } from '../message/helpers/message.fixture';
import { ParticipantsGuard } from './participants.guard';
import { Reflector } from '@nestjs/core';
import {
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { MessageService } from '../message/message.service';
import { MessageDBModule } from '../message/message.db';
import { RedisModule } from '../redis.module';

describe('ParticipantsGuard', () => {
  let participantsGuard: ParticipantsGuard;
  let messageService: MessageService;

  const mockReflector = {
    getAllAndOverride: jest.fn(),
  };

  let redisSendResult = '1';
  const redisClient = {
    send: () => ({
      subscribe: (observer: any) => {
        observer.next(redisSendResult);
        observer.complete();
      },
    }),
  };

  const mockContext = {
    switchToHttp: () => ({
      getRequest: () => ({
        headers: {
          authorization: 'token',
        },
        user: {},
        params: {
          chatId: chatId,
        },
      }),
      getResponse: jest.fn(),
      getNext: jest.fn(),
    }),
    getHandler: jest.fn(),
    getClass: jest.fn(),
    getArgs: jest.fn(),
    getArgByIndex: jest.fn(),
    switchToRpc: jest.fn(),
    switchToWs: jest.fn(),
    getType: jest.fn(),
  } as ExecutionContext;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [MessageDBModule],
      providers: [
        ParticipantsGuard,
        { provide: Reflector, useValue: mockReflector },
        { provide: 'REDIS_SERVICE', useValue: redisClient },
        MessageService,
        ConfigService,
        JwtService,
      ],
    }).compile();

    participantsGuard = moduleRef.get<ParticipantsGuard>(ParticipantsGuard);
    messageService = moduleRef.get<MessageService>(MessageService);
  });

  it('should be return true', async () => {
    const participants = [
      '65b4fe01bf708e1a9dcfdf01',
      '65b4fe1fbf708e1a9dcfdf03',
    ];

    jest
      .spyOn(participantsGuard, 'getUserIdFromToken')
      .mockImplementation(() => '65b4fe01bf708e1a9dcfdf01');
    jest
      .spyOn(messageService, 'getUsersOfChat')
      .mockImplementation(async () => participants);

    await expect(participantsGuard.canActivate(mockContext)).resolves.toBe(
      true,
    );
  });

  it('should be return UnauthorizedException', async () => {
    const participants = ['65b4fe1fbf708e1a9dcfdf03'];

    jest
      .spyOn(participantsGuard, 'getUserIdFromToken')
      .mockImplementation(() => '65b4fe01bf708e1a9dcfdf01');
    jest
      .spyOn(messageService, 'getUsersOfChat')
      .mockImplementation(async () => participants);

    await expect(participantsGuard.canActivate(mockContext)).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
