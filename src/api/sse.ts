export function withSSE(endpoint: string, callback: (text: string) => void) {
  const source = new EventSource(endpoint);
  let msg = '';
  source.addEventListener('message', function(e) {
    msg += JSON.parse(e.data).data;
    callback(msg);
  });
  source.addEventListener('error', function(e: any) {
    source.close();
  })
}