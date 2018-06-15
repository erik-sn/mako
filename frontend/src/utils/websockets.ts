import { eventChannel } from 'redux-saga';

import { IMap } from '../interfaces/general';

export interface ITypes {
  success: string;
  failure: string;
  error: string;
  closed: string;
}

export function websocketInitChannel(url: string, { success, failure, error, closed }: ITypes) {
  return eventChannel((emitter: any) => {
    const ws = new WebSocket(url) as Socket;

    ws.onopen = () => {
      return emitter({ type: success, payload: ws });
    };

    ws.onerror = (e: Event) => {
      return emitter({ type: failure, payload: e });
    };

    ws.onmessage = (message: MessageEvent) => {
      const data = JSON.parse(message.data);
      return emitter({ type: data.type, payload: data.payload });
    };

    ws.post = (json: IMap<any>) => {
      try {
        ws.send(JSON.stringify(json));
      } catch (e) {
        return emitter({ type: error, payload: e });
      }
    };

    ws.onclose = () => {
      return emitter({ type: closed, payload: null });
    };

    // unsubscribe function
    return () => {
      ws.close();
    };
  });
}
