import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  CanActivate,
} from '@nestjs/common';
import { ChatService } from '../chat/chat.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

export const ROLES_KEY = 'roles';

@Injectable()
export class OwnerOrAdminGuard implements CanActivate {
  constructor(
    private readonly chatService: ChatService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.replace('Bearer ', '');
    const { chatId } = request.params;

    const userId = await this.getUserIdFromToken(token);
    const chat = await this.chatService.findOne(chatId);
    const isAdmin = await this.chatService.checkChatsAdmin(chatId, userId);

    if (userId === chat.createdBy || isAdmin) {
      return true;
    }
    throw new UnauthorizedException('You do not have a necessary access');
  }

  getUserIdFromToken(_id: string) {
    const secret = this.configService.get('JWT_SECRET');
    const decodedToken = this.jwtService.verify(_id, { secret });

    return decodedToken.userId;
  }
}
