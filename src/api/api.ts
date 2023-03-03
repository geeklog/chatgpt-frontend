const CHATGPT_API_ENDPOINT = 'https://chatgpt-api-server.vercel.app/chat'
// const CHATGPT_API_ENDPOINT = 'http://127.0.0.1:5000/chat'

export async function chat(message: string, sessionID: string) {
  const response = await fetch(CHATGPT_API_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: message,
      session: sessionID
    })
  });
  const data = await response.json();
  return data.answer.trim();
}