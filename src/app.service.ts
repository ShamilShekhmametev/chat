import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { REDIS_SERVICE } from './redis.module';

@Injectable()
export class AppService {
  constructor(@Inject(REDIS_SERVICE) private userClient: ClientProxy) {}

  getHello(): string {
    return 'Hello World!';
  }

  async getUserById(id: string) {
    return this.userClient.send({ cmd: 'get' }, id);
  }
}
