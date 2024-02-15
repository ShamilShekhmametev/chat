import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import {
  createDefaultMessage,
  createDefaultUser,
  userId,
  userIdForUpdate,
  userInfoForUpdate,
} from './helpers/user.fixture';
import { RedisModule } from '../redis.module';
import { UserDBModule } from './user.db';
import { CreateUserDto } from './dto/create-user.dto';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [RedisModule, UserDBModule],
      controllers: [UserController],
      providers: [UserService],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be create user', async () => {
    const user = createDefaultUser();
    jest.spyOn(service, 'create').mockImplementation(async () => user);
    const createdUser = await controller.create(user);

    expect(createdUser).toBe(user);
  });

  it('should be update user', async () => {
    const user = createDefaultUser();
    jest.spyOn(service, 'update').mockImplementation(async () => user);
    const updatedUser = await controller.update(userIdForUpdate, user);

    expect(updatedUser).toBe(user);
  });

  it('should be delete user', async () => {
    const user = createDefaultUser();
    jest.spyOn(service, 'remove').mockImplementation(async () => user);
    const removedUser = await controller.remove(userId);

    expect(removedUser).toBe(user);
  });
});
