import { CreateMessageDto } from '../dto/create-message.dto';
import { UpdateMessageDto } from '../dto/update-message.dto';

export const createDefaultMessage = () => {
  const message: CreateMessageDto = {
    messageFrom: '65b4fe01bf708e1a9dcfdf01',
    chat: '65b4fe1fbf708e1a9dcfdf03',
    createdAt: new Date(Date.now()),
    text: 'HI',
  };
  return message;
};

export const createDefaultMessageMassive = () => {
  const message = [createDefaultMessage()];
  return message;
};

export const createMessageForUpdate = () => {
  const message: UpdateMessageDto = {
    text: 'Bye',
  };
  return message;
};

export const messageId = '65b50eaf502bf06e25715ac2';
export const chatId = '65bfaccaf68dee98d030da0e';

export const TIME = {
  TODAY: 'today',
  WEEK: 'week',
};
