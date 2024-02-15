import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from '../user/user.schema';

export type MessageDocument = HydratedDocument<Message>;

@Schema()
export class Message {
  @Prop()
  text: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: false })
  seen: boolean;

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  messageFrom: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  chat: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
