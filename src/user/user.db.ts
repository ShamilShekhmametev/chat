import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './user.schema';

export const DB_CONNECTION_NAME = 'users';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('MONGO_CONNECTION_STRING_USERS'),
      }),
      connectionName: DB_CONNECTION_NAME,
      inject: [ConfigService],
    }),
    MongooseModule.forFeature(
      [{ name: 'User', schema: UserSchema }],
      DB_CONNECTION_NAME,
    ),
  ],
})
export class UserDBModule {}
