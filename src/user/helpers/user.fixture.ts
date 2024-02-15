import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

export const createDefaultUser = () => {
  const user: CreateUserDto = {
    username: 'Kamil',
    email: 'kamil@mail.ru',
    password: '123',
    roles: ['user'],
  };
  return user;
};

export const createDefaultMessage = () => {
  const message = {
    messageFrom: '65b4fe01bf708e1a9dcfdf01',
    messageTo: '65b4fe1fbf708e1a9dcfdf03',
    message: { text: 'HI' },
  };
  return message;
};

export const userIdForUpdate = '65b4fe1fbf708e1a9dcfdf03';
export const userId = '65b640e6f12f7329aee2bf04';

export const userInfoForUpdate = () => {
  const user: UpdateUserDto = {
    email: 'minimars@mail.ru',
  };
  return user;
};
