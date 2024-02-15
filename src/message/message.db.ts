import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageSchema } from './message.schema';

export const DB_CONNECTION_NAME = 'messages';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('MONGO_CONNECTION_STRING_MESSAGES'),
      }),
      connectionName: DB_CONNECTION_NAME,
      inject: [ConfigService],
    }),
    MongooseModule.forFeature(
      [{ name: 'Message', schema: MessageSchema }],
      DB_CONNECTION_NAME,
    ),
  ],
})
export class MessageDBModule {}
