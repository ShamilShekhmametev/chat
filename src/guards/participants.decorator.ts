import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { OwnerOrAdminGuard } from './ownerOrAdmin.guard';
import { ParticipantsGuard } from './participants.guard';

export const PARTICIPANTS_OF_CHAT = 'Participants of Chat';
export const Participants = () => {
  return applyDecorators(
    SetMetadata(Participants, true),
    UseGuards(ParticipantsGuard),
  );
};
