export function withSSE(endpoint: string, callback: (text: string) => void) {
  const sseEndpoint = process.env.REACT_APP_CHATGPT_SSE_ENDPOINT! + `/${endpoint}`
  const source = new EventSource(sseEndpoint);
  let msg = '';
  source.addEventListener('message', function(e) {
    msg += JSON.parse(e.data).msg;
    callback(msg);
  });
  source.addEventListener('error', function(e: any) {
    source.close();
  })
}