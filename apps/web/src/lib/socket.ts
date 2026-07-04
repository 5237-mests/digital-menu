import { REALTIME_EVENTS } from '@restaurant/shared-constants';
import type { OrderDetail } from '@restaurant/shared-types';
import { io, type Socket } from 'socket.io-client';

// const SOCKET_URL = import.meta.env.PUBLIC_API_URL ?? undefined;
const SOCKET_URL = 'https://www.menu.hypertechtechnology.com';

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling']
    });
  }

  return socket;
}

export function onOrderCreated(handler: (payload: OrderDetail) => void): () => void {
  const client = getSocket();
  client.on(REALTIME_EVENTS.orderCreated, handler);
  return () => client.off(REALTIME_EVENTS.orderCreated, handler);
}

export function onOrderUpdated(handler: (payload: OrderDetail) => void): () => void {
  const client = getSocket();
  client.on(REALTIME_EVENTS.orderUpdated, handler);
  return () => client.off(REALTIME_EVENTS.orderUpdated, handler);
}

export function onKitchenQueueUpdated(handler: () => void): () => void {
  const client = getSocket();
  client.on(REALTIME_EVENTS.kitchenQueueUpdated, handler);
  return () => client.off(REALTIME_EVENTS.kitchenQueueUpdated, handler);
}
