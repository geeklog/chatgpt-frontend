import { Message } from "../types";

export async function chat(message: string, sessionID: string, pair: string) {
  const response = await fetch(process.env.REACT_APP_CHATGPT_API_ENDPOINT!, {
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

export async function chatStream(sessionID: string, pair: string, history: Message[]) {
  const response = await fetch(process.env.REACT_APP_CHATGPT_API_ENDPOINT!, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      session: sessionID,
      pair,
      history
    })
  });
  if (response.status === 200) {
    const data = await response.json();
    if (data.status === 'ok') {
      // withSSE(data.endpoint, callback);
    } else {
      throw new Error(`${data.status}`);
    }
  }
}