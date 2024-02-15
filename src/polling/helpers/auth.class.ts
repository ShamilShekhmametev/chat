import { Socket } from 'socket.io';

export interface AuthSocket extends Socket {
  user: { email: string; userId: string; roles: string[] };
  chats: string[];
}

export interface JwtPayload {
  email: string;
  userId: string;
  roles: string[];
}

export const authUser = {
  userId: '65b4fe01bf708e1a9dcfdf01',
  email: 'shamil@mail.ru',
};

export const authUserToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWI0ZmUwMWJmNzA4ZTFhOWRjZmRmMDEiLCJlbWFpbCI6InNoYW1pbEBtYWlsLnJ1IiwiaWF0IjoxNzA3MDUyMzE3fQ.LLLw5AvXKuv1tOR8KIDdJFos6DSukb3g3iF0D8gCrv4';
