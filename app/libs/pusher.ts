import PusherServer from 'pusher'
import PusherClient from 'pusher-js'

export const pusherServer = new PusherServer({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.PUSHER_CLUSTER!,
  useTLS: true,
});

export const pusherClient = new PusherClient(
  process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
  {
    channelAuthorization: {
      endpoint: '/api/pusher/auth',
      transport: 'ajax',
    },
    cluster: 'ap3',
  }
);

export async function PusherTriggerChunked(channel: string, event: string, data: any) {
  const chunkSize = 9000;  // artificially small! Set it to more like 9000
  const str = JSON.stringify(data);
  const msgId = Math.random() + '';
  for (var i = 0; i*chunkSize < str.length; i++) {
    // TODO: use pusher.triggerBatch for better performance
      await pusherServer.trigger(channel, event, { 
      id: msgId, 
      index: i, 
      chunk: str.substring(i*chunkSize, chunkSize), 
      final: chunkSize*(i+1) >= str.length
    });
  }
}