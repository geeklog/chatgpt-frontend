const Pusher = window.Pusher;

// Pusher.logToConsole = true;

export const pusher = new Pusher(process.env.REACT_APP_PUSHER_KEY, {
  cluster: process.env.REACT_APP_PUSHER_CLUSTER
});


