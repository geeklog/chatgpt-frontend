export async function chat(message: string, sessionID: string) {
  const response = await fetch(process.env.REACT_APP_CHATGPT_API_ENDPOINT!, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: message,
      session: sessionID
    })
  });
  if (response.status === 200) {
    const data = await response.json();
    if (data.status === 'ok') {
      return data.answer.trim();
    } else {
      throw new Error(`${data.answer}`);
    }
  }
  throw new Error('' + response.text);
}