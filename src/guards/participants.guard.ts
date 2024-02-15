import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  CanActivate,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MessageService } from '../message/message.service';

@Injectable()
export class ParticipantsGuard implements CanActivate {
  constructor(
    private readonly messageService: MessageService,
    private readonly jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.replace('Bearer ', '');

    const userId = this.getUserIdFromToken(token);

    const { chatId } = request.params;

    const participants = (await this.messageService.getUsersOfChat(
      chatId,
    )) as string[];

    if (participants.includes(userId)) {
      return true;
    } else {
      throw new UnauthorizedException('You are not a participant of chat');
    }
  }

  getUserIdFromToken(_id: string) {
    const secret = this.configService.get('JWT_SECRET');
    const decodedToken = this.jwtService.verify(_id, { secret });

    return decodedToken.userId;
  }
}
