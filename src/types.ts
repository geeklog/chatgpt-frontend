export enum Sender {
  User,
  Bot
}

export enum MessageStatus {
  Normal,
  Pending,
  Error
}

export interface Message {
  sender: Sender;
  msg: string;
  status: MessageStatus,
  pair: string; // 用来标记移除Pending
  sessionID: string;
}