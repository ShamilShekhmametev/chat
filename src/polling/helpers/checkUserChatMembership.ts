export function checkUserChatMembership(
  userChats: string[],
  messageChat: string,
) {
  return userChats.includes(messageChat);
}
