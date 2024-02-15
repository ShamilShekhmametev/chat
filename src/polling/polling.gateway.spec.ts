import { Test } from '@nestjs/testing';
import { PollingGateway } from './polling.gateway';
import { PollingService } from './polling.service';
import { Socket, io } from 'socket.io-client';
import { RedisModule } from '../redis.module';
import { ConfigModule } from '@nestjs/config';
import { authUser, authUserToken } from './helpers/auth.class';

describe('PollingGateway', () => {
  let gateway: PollingGateway;
  let app: any;
  let ioClient: Socket;
  let service: PollingService;

  beforeEach(async () => {
    const testingModule = await Test.createTestingModule({
      imports: [RedisModule, ConfigModule.forRoot()],
      providers: [PollingGateway, PollingService],
    }).compile();

    gateway = testingModule.get<PollingGateway>(PollingGateway);
    service = testingModule.get<PollingService>(PollingService);

    ioClient = io('ws://localhost:3001', {
      autoConnect: false,
      transports: ['websocket'],
      auth: {
        token: authUserToken,
      },
    });
    app = await testingModule.createNestApplication();
    app.listen(3001);
  });

  afterEach(async () => {
    await app.close();
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  it('should emit -pong', async () => {
    ioClient.connect();

    await new Promise<void>((resolve) => {
      ioClient.on('connect', () => {
        ioClient.emit('ping');
      });
      ioClient.on('pong', (data) => {
        expect(data).toBe('pong data');
        resolve();
      });
    });
    ioClient.disconnect();
  });

  it('check client data', async () => {
    ioClient.connect();

    const spy = jest.spyOn(service, 'handleMessage');

    await new Promise<void>((resolve) => {
      ioClient.on('connect', () => {
        ioClient.emit('message');
      });
      ioClient.on('clientData', (data) => {
        console.log(data);
        const { email } = data;
        const userId = 'Shamil';
        expect(email).toBe(authUser.email);
        expect(userId).toBe(authUser.userId);
        resolve();
      });
    });

    expect(spy).toHaveBeenCalled();
    ioClient.disconnect();
  });
});
