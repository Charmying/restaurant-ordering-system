import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject, merge } from 'rxjs';
import { map } from 'rxjs/operators';
import { EVENTS_WS_ORIGIN } from '../config/api.config';
import { io, Socket } from 'socket.io-client';

export type OrderDomainEvent = 'order:created' | 'order:served' | 'order:completed' | 'order:cancelled';

@Injectable({
  providedIn: 'root',
})
export class EventsWsService implements OnDestroy {
  private socket: Socket | null = null;
  private readonly destroy$ = new Subject<void>();
  private readonly orderCreated$ = new Subject<unknown>();
  private readonly orderServed$ = new Subject<unknown>();
  private readonly orderCompleted$ = new Subject<unknown>();
  private readonly orderCancelled$ = new Subject<unknown>();

  get onOrderCreated(): Observable<unknown> {
    this.ensureConnected();
    return this.orderCreated$.asObservable();
  }

  get onOrderServed(): Observable<unknown> {
    this.ensureConnected();
    return this.orderServed$.asObservable();
  }

  get onOrdersChanged(): Observable<void> {
    this.ensureConnected();
    return merge(
      this.orderCreated$.pipe(map(() => undefined)),
      this.orderServed$.pipe(map(() => undefined)),
      this.orderCompleted$.pipe(map(() => undefined)),
      this.orderCancelled$.pipe(map(() => undefined))
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.disconnect();
  }

  private ensureConnected(): void {
    if (this.socket?.connected) return;
    if (this.socket) return;

    const url = EVENTS_WS_ORIGIN;
    this.socket = io(`${url}/events`, {
      path: '/socket.io',
      transports: ['websocket', 'polling'],
      autoConnect: true,
    });

    this.socket.on('order:created', (payload: unknown) => {
      this.orderCreated$.next(payload);
    });
    this.socket.on('order:served', (payload: unknown) => {
      this.orderServed$.next(payload);
    });
    this.socket.on('order:completed', (payload: unknown) => {
      this.orderCompleted$.next(payload);
    });
    this.socket.on('order:cancelled', (payload: unknown) => {
      this.orderCancelled$.next(payload);
    });
    this.socket.on('connect_error', (err: Error) => {
      console.warn('[EventsWs] connect_error', err.message);
    });
  }

  private disconnect(): void {
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
    }
  }
}
