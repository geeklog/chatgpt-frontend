import { Observable, of } from 'rxjs';
import { mergeAll, concatMap, delay } from 'rxjs/operators';
import { insertSeparatorBetween } from '../utils/array';

const Pusher = window.Pusher;

// Pusher.logToConsole = true;

export const pusher = new Pusher(process.env.REACT_APP_PUSHER_KEY, {
  cluster: process.env.REACT_APP_PUSHER_CLUSTER
});

export function withPusher(eventId: string, callback: (text: string) => void) {
  let fullText = '';

  const channel = pusher.subscribe(`channel-${process.env.REACT_APP_PUSHER_ENV}`);

  const messageStream = new Observable<string[]>(observer => {
    channel.bind(eventId, ({message}: {message: string}) => {
      observer.next(insertSeparatorBetween(message.split(' '), ' '))
    });
  })

  messageStream
    .pipe(
      mergeAll(),
      concatMap(i => of(i).pipe(delay(50)))
    )
    .subscribe(msg => {
      if (!msg)
        return;
      const t = new Date();
      fullText += msg
      callback(fullText);
    });
}


