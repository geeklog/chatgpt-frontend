const Pusher = window.Pusher;

// Pusher.logToConsole = true;

export const pusher = new Pusher(process.env.REACT_APP_PUSHER_KEY, {
  cluster: process.env.REACT_APP_PUSHER_CLUSTER
});

export function suscribePusherStream() {
  // useEffect(() => {
  //   pusher.subscribe(`session-${sessionID}`).bind(`session-start`, ({pair}: {pair: string}) => {
  //     receiveMessagesFromPusher(`conversation-${sessionID}-${pair}`, 'answer-stream', ({msg, pair}) => {
  //       setMessages(
  //         streamingAnswer({
  //           messages: getMessages(),
  //           pair,
  //           media: MessageMedia.Text,
  //           answer: msg,
  //           sessionID
  //         })
  //       );
  //       scrollToBottom();
  //     })
  //   });
  // }, [sessionID])
}
