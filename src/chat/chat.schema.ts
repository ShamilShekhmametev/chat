import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from '../user/user.schema';

export type ChatDocument = HydratedDocument<Chat>;

@Schema()
export class Chat {
  @Prop()
  name: string;

  @Prop()
  participants: string[];

  @Prop()
  admins: string[];

  @Prop()
  createdBy: string;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
