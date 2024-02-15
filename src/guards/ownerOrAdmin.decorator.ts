import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { OwnerOrAdminGuard } from './ownerOrAdmin.guard';

export const OWNER_OR_ADMIN_CHAT = 'Admin or Owner for Chat';
export const OwnerOrAdmin = () => {
  return applyDecorators(
    SetMetadata(OwnerOrAdmin, true),
    UseGuards(OwnerOrAdminGuard),
  );
};
