export enum Sender {
  User,
  Bot
}

export enum MessageStatus {
  Normal,
  Pending,
  Error
}

export enum MessageMedia {
  Image = 'image',
  Text = 'text'
}

export interface Message {
  sender: Sender;
  media: MessageMedia;
  msg: string;
  status: MessageStatus,
  pair: string; // 用来标记移除Pending
  sessionID: string;
}