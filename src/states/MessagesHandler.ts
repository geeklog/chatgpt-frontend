import { Message, MessageMedia, MessageStatus, Sender } from "../types";

export const userMessage = (msg: string, pair: string, sessionID: string) => ({
  sender: Sender.User,
  media: MessageMedia.Text,
  msg,
  status: MessageStatus.Normal,
  pair,
  sessionID,
  time: new Date()
});

export const botPending = (pair: string, sessionID: string) => ({
  sender: Sender.Bot,
  media: MessageMedia.Text,
  msg: '...',
  status: MessageStatus.Pending,
  pair,
  sessionID,
  time: new Date()
})

export const replaceBotPendingBubbleWithAnswer = (
  {messages, pair, media, answer, sessionID}: {messages: Message[], pair: string, media: MessageMedia, answer: string, sessionID: string}
): Message[] => {
  const pending = messages.find(msg =>
    msg.pair === pair && msg.sender === Sender.Bot && msg.status === MessageStatus.Pending
  );
  if (pending) {
    pending.status = MessageStatus.Normal;
    pending.msg = answer;
  }
  return [...messages];
}

export const replaceBotPendingBubbleWithError = (
  {messages, pair, errorMessage, sessionID}: {messages: Message[], pair: string, errorMessage: string, sessionID: string}
): Message[] => {
  const pending = messages.find(msg =>
    msg.pair === pair && msg.sender === Sender.Bot && msg.status === MessageStatus.Pending
  );
  if (pending) {
    pending.status = MessageStatus.Error;
    pending.msg = errorMessage;
  }
  return [...messages];
}

export const replaceBotErrorBubbleWithPending = (
  {messages, pair, sessionID}: {messages: Message[], pair: string, sessionID: string}
): Message[] => {
  const pending = messages.find(msg =>
    msg.pair === pair && msg.sender === Sender.Bot && msg.status === MessageStatus.Error
  );
  if (pending) {
    pending.status = MessageStatus.Pending;
    pending.msg = '...';
    pending.time = new Date();
  }
  return [...messages];
}

export const getLastestUserQuery = (messages: Message[], pair: string) => {
  return messages.filter(msg => msg.pair === pair && msg.sender === Sender.User).pop()?.msg;
}
