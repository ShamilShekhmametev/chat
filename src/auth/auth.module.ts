import { Module, Redirect } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { UserDBModule } from 'src/user/user.db';
import { RedisModule } from 'src/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PassportModule,
    JwtModule,
    UserDBModule,
    RedisModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtService, JwtStrategy, ConfigService],
})
export class AuthModule {}
