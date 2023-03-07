import { Message, MessageMedia, MessageStatus, Sender } from "../types";

export const replaceBotPendingBubbleWithAnswer = (
  {messages, pair, media, answer, sessionID}: {messages: Message[], pair: string, media: MessageMedia, answer: string, sessionID: string}
): Message[] => {
  const newMsgs = [];
  for (let i=0; i<messages.length; i++) {
    const msg = messages[i];
    if (!(msg.pair === pair && msg.sender === Sender.Bot && msg.status === MessageStatus.Pending)) {
      newMsgs.push(msg);
      continue;
    }
    newMsgs.push({
      sender: Sender.Bot,
      msg: answer,
      media,
      status: MessageStatus.Normal,
      pair,
      sessionID,
      time: new Date()
    });
  }
  return newMsgs;
}

export const replaceBotPendingBubbleWithError = (
  {messages, pair, errorMessage, sessionID}: {messages: Message[], pair: string, errorMessage: string, sessionID: string}
): Message[] => {
  const newMsgs = [];
  for (let i=0; i<messages.length; i++) {
    const msg = messages[i];
    if (!(msg.pair === pair && msg.sender === Sender.Bot && msg.status === MessageStatus.Pending)) {
      newMsgs.push(msg);
      continue;
    }
    newMsgs.push({
      sender: Sender.Bot,
      media: MessageMedia.Text,
      msg: errorMessage,
      status: MessageStatus.Error,
      pair,
      sessionID,
      time: new Date()
    });
  }
  return newMsgs;
}

export const replaceBotErrorBubbleWithPending = (
  {messages, pair, sessionID}: {messages: Message[], pair: string, sessionID: string}
): Message[] => {
  const newMsgs = [];
  for (let i=0; i<messages.length; i++) {
    const msg = messages[i];
    if (!(msg.pair === pair && msg.sender === Sender.Bot && msg.status === MessageStatus.Error)) {
      newMsgs.push(msg);
      continue;
    }
    newMsgs.push({
      sender: Sender.Bot,
      media: MessageMedia.Text,
      msg: '...',
      status: MessageStatus.Pending,
      pair,
      sessionID,
      time: new Date()
    });
  }
  return newMsgs;
}

export const getLastestUserQuery = (messages: Message[], pair: string) => {
  return messages.filter(msg => msg.pair === pair && msg.sender === Sender.User).pop()?.msg;
}
