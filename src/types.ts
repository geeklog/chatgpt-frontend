export enum Sender {
  User = 'user',
  Bot = 'bot'
}

export enum MessageStatus {
  Normal,
  Pending,
  Error
}

export enum MessageMedia {
  Image = 'image',
  Text = 'text',
  File = 'file'
}

export interface Message {
  sender: Sender;
  media: MessageMedia;
  msg: string;
  file?: Attachment;
  time: Date;
  status: MessageStatus,
  pair: string; // 用来标记移除Pending
  sessionID: string;
  attachments?: Attachment[];
}

export interface Session {
  id: string;
  title: string;
  history: Message[];
}

export interface Pusher {
  
}

export interface Attachment {
  file_name: string;
  file_type: string;
  file_size: number;
  extracted_content: string;
}

export type ModelType = 'ChatGPT' | 'Claude2';

export type IconButtonRef = React.MutableRefObject<HTMLButtonElement | null>;