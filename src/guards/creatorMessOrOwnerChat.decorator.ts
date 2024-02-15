import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ChatCreatorGuard } from './creator.guard';
import { CreatorOwnerChatGuard } from './creatorMessOrOwnerChat.guard';

export const CREATOR_OR_OWNER_CHAT = 'Creator or Owner Chat';
export const CreatorOrOwnerChat = () => {
  return applyDecorators(
    SetMetadata(CreatorOrOwnerChat, true),
    UseGuards(CreatorOwnerChatGuard),
  );
};
