import { Observable, of } from 'rxjs';
import { mergeAll, concatMap, delay } from 'rxjs/operators';
import { insertSeparatorBetween } from '../utils/array';
import { pusher } from '../api/pusher';
import { Attachment, Message, MessageMedia, MessageStatus, Sender } from '../types';

export const userMessage = (msg: string, pair: string, sessionID: string, attachments?: Attachment[]) => ({
  sender: Sender.User,
  media: MessageMedia.Text,
  msg,
  status: MessageStatus.Normal,
  pair,
  sessionID,
  attachments,
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

export const removePendingMessages = (messages: Message[]) => {
  return messages.filter(m => m.status !== MessageStatus.Pending);
}

export const streamingAnswer = (
  {messages, pair, media, answer, sessionID}: {messages: Message[], pair: string, media: MessageMedia, answer: string, sessionID: string}
): Message[] => {
  const streaming = messages.find(msg =>
    msg.pair === pair && msg.sender === Sender.Bot
  );
  if (streaming) {
    streaming.status = MessageStatus.Normal;
    streaming.msg = answer;
  }
  return [...messages];
}

export const getLastestUserQuery = (messages: Message[], pair: string) => {
  return messages.filter(msg => msg.pair === pair && msg.sender === Sender.User).pop()?.msg;
}

type MsgRes = {
  msg: string;
  pair: string;
}

export function receiveMessagesFromPusher(channelName: string, eventId: string, callback: (text: MsgRes) => void) {
  let fullText = '';

  const channel = pusher.subscribe(channelName);

  const messageStream = new Observable<MsgRes[]>(observer => {
    channel.bind(eventId, ({pair, message}: {pair: string, message: string}) => {
      observer.next(
        insertSeparatorBetween(message.split(' '), ' ')
          .map(msg => ({msg, pair}))
      )
    });
  })

  messageStream
    .pipe(
      mergeAll(),
      concatMap(i => of(i).pipe(delay(50)))
    )
    .subscribe(({msg, pair}) => {
      if (!msg)
        return;
      const t = new Date();
      fullText += msg
      callback({msg: fullText, pair});
    });
}