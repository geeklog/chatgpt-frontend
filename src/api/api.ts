import { Attachment, Message } from "../types";
import { withSSE } from "./sse";

export async function chat(message: string, sessionID: string, pair: string) {
  const response = await fetch(process.env.REACT_APP_API_ENDPOINT!, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: message,
      session: sessionID,
      pair
    })
  });
  if (response.status === 200) {
    const data = await response.json();
    if (data.status === 'ok') {
      return {
        media: data.media,
        answer: data.answer.trim(),
        pair: data.pair
      }
    } else {
      throw new Error(`${data.answer}`);
    }
  }
  throw new Error('' + response.text);
}

export async function chatStream(
  chatType: 'claude2' | 'azure-chatgpt3',
  sessionID: string,
  pair: string,
  history: Message[],
  attachments: Attachment[],
  onMessage?: (msg: string) => void
) {
  const sseEndpoint = process.env.REACT_APP_API_ENDPOINT! + `/chat/${chatType}`;
  const response = await fetch(sseEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      session: sessionID,
      pair,
      history,
      attachments
    })
  });
  if (response.status === 200) {
    const data = await response.json();
    if (data.status === 'ok') {
      onMessage && withSSE(process.env.REACT_APP_API_ENDPOINT! + '/sse/' + data.stream_id, onMessage);
    } else {
      throw new Error(`${data.status}`);
    }
  }
}

export async function upload(form: FormData) {
  const uploadEndpoint = process.env.REACT_APP_API_ENDPOINT! + '/upload';
  const response = await fetch(uploadEndpoint, {
    method: 'POST',
    body: form,
  });
  const res = await response.json();
  return res;
}