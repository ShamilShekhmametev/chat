import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthDto } from './dto/create-auth.dto';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { User, UserDocument } from '../user/user.schema';
import { LoginDto } from './dto/login.dto';
import { ERROR_MESSAGE } from '../errors/errors';
import { REDIS_SERVICE } from '../redis.module';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { CMD_MESSAGES } from 'src/helpers/constants';

@Injectable()
export class AuthService {
  userModel: import('mongoose').Model<any, unknown, unknown, {}, any, any>;
  constructor(
    @InjectConnection('users') private connection: Connection,
    private jwtService: JwtService,
    private configService: ConfigService,
    @Inject(REDIS_SERVICE) private client: ClientProxy,
  ) {
    this.userModel = this.connection.model(User.name);
  }

  generateToken({ userId, email, roles }: AuthDto) {
    const secret = this.configService.get('JWT_SECRET');
    return this.jwtService.sign({ userId, email, roles }, { secret });
  }

  async login(loginDto: LoginDto): Promise<UserDocument> {
    const userRequest = this.client.send(CMD_MESSAGES.GET_USER, {
      email: loginDto.email,
    });
    const user = await lastValueFrom(userRequest);

    if (user.password !== loginDto.password)
      throw new Error(ERROR_MESSAGE.INCOR_LOGIN_OR_PASSWORD);
    return user;
  }
}
