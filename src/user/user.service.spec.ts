import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { RedisModule } from '../redis.module';
import { UserDBModule } from './user.db';
import {
  createDefaultUser,
  userId,
  userIdForUpdate,
  userInfoForUpdate,
} from './helpers/user.fixture';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [RedisModule, UserDBModule],
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be create user', async () => {
    const user = createDefaultUser();
    const createdUser = await service.create(user);

    expect(createdUser.username).toBe(user.username);
    expect(createdUser.email).toBe(user.email);
    expect(createdUser.password).toBe(user.password);
    expect(createdUser.roles).toStrictEqual(user.roles);
  });

  it('should be update user', async () => {
    const userInfo = userInfoForUpdate();
    const updatedUser = await service.update(userIdForUpdate, userInfo);

    expect(updatedUser.email).toBe(userInfo.email);
  });

  it('should be delete user', async () => {
    const result = await service.remove(userId);

    expect(result).toBeDefined();
  });
});
