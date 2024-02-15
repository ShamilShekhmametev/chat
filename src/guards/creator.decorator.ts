import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ChatCreatorGuard } from './creator.guard';

export const CREATOR_CHAT = 'Creator of Chat';
export const CreatorChat = () => {
  return applyDecorators(
    SetMetadata(CreatorChat, true),
    UseGuards(ChatCreatorGuard),
  );
};
