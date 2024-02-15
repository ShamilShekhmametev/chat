import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatSchema } from './chat.schema';

export const DB_CONNECTION_NAME = 'chats';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('MONGO_CONNECTION_STRING_CHATS'),
      }),
      connectionName: DB_CONNECTION_NAME,
      inject: [ConfigService],
    }),
    MongooseModule.forFeature(
      [{ name: 'Chat', schema: ChatSchema }],
      DB_CONNECTION_NAME,
    ),
  ],
})
export class ChatDBModule {}
