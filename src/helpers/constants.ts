export const CMD_MESSAGES = {
  GET_USER: { cmd: 'get user' },
  GET_CHATS: { cmd: 'get chats' },
  GET_OWNER_CHAT: { cmd: 'get owner chat' },
  GET_ALL_USERS: { cmd: 'get all users' },
};

export const CLIENT_MESSAGES = {
  MESSAGE: 'message',
  MESSAGE_SEEN: 'messageSeen',
  PING: 'ping',
};

export const EVENTS = {
  MESSAGE_ARRIVED: 'messageArrived',
  SEEN_ARRIVED: 'seenArrived',
  PONG: 'pong',
  MESSAGE: 'message',
  MESSAGE_HANDLED: 'messageHandled',
};
