import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  CanActivate,
} from '@nestjs/common';
import { MessageService } from '../message/message.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class CreatorOwnerChatGuard implements CanActivate {
  constructor(
    private readonly messageService: MessageService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.replace('Bearer ', '');
    const { messageId } = request.params;

    const userId = await this.getUserIdFromToken(token);
    const message = await this.messageService.findOne(messageId);
    const ownerId = await this.messageService.handleCreatorOfChat(userId);

    if (userId === ownerId || message.messageFrom === userId) {
      return true;
    }
    throw new UnauthorizedException('You are not a creator of message');
  }

  getUserIdFromToken(_id: string) {
    const secret = this.configService.get('JWT_SECRET');
    const decodedToken = this.jwtService.verify(_id, { secret });

    return decodedToken.userId;
  }
}
