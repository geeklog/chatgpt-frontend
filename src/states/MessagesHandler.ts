import { Message, MessageStatus, Sender } from "../types";

export const replaceBotPendingBubbleWithAnswer = (msgs: Message[], pair: string, answer: string) => {
  const newMsgs = [];
  for (let i=0; i<msgs.length; i++) {
    const msg = msgs[i];
    if (!(msg.pair === pair && msg.sender === Sender.Bot && msg.status === MessageStatus.Pending)) {
      newMsgs.push(msg);
      continue;
    }
    newMsgs.push({sender: Sender.Bot, msg: answer, status: MessageStatus.Normal, pair});
  }
  return newMsgs;
}

export const replaceBotPendingBubbleWithError = (msgs: Message[], pair: string, errorMessage: string) => {
  const newMsgs = [];
  for (let i=0; i<msgs.length; i++) {
    const msg = msgs[i];
    if (!(msg.pair === pair && msg.sender === Sender.Bot && msg.status === MessageStatus.Pending)) {
      newMsgs.push(msg);
      continue;
    }
    newMsgs.push({sender: Sender.Bot, msg: errorMessage, status: MessageStatus.Error, pair});
  }
  return newMsgs;
}

export const replaceBotErrorBubbleWithPending = (msgs: Message[], pair: string) => {
  const newMsgs = [];
  for (let i=0; i<msgs.length; i++) {
    const msg = msgs[i];
    if (!(msg.pair === pair && msg.sender === Sender.Bot && msg.status === MessageStatus.Error)) {
      newMsgs.push(msg);
      continue;
    }
    newMsgs.push({sender: Sender.Bot, msg: '...', status: MessageStatus.Pending, pair});
  }
  return newMsgs;
}

export const getLastestUserQuery = (msgs: Message[], pair: string) => {
  return msgs.filter(msg => msg.pair === pair && msg.sender === Sender.User).pop()?.msg;
}
