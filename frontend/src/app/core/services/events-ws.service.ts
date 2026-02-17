import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject, merge } from 'rxjs';
import { map } from 'rxjs/operators';
import { EVENTS_WS_ORIGIN } from '../config/api.config';
import { io, Socket } from 'socket.io-client';

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
  private readonly serviceCall$ = new Subject<unknown>();
  private readonly serviceCallHandled$ = new Subject<unknown>();
  private readonly menuCreated$ = new Subject<unknown>();
  private readonly menuUpdated$ = new Subject<unknown>();
  private readonly menuDeleted$ = new Subject<unknown>();

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

  get onServiceCall(): Observable<unknown> {
    this.ensureConnected();
    return this.serviceCall$.asObservable();
  }

  get onServiceCallHandled(): Observable<unknown> {
    this.ensureConnected();
    return this.serviceCallHandled$.asObservable();
  }

  get onMenuChanged(): Observable<void> {
    this.ensureConnected();
    return merge(
      this.menuCreated$.pipe(map(() => undefined)),
      this.menuUpdated$.pipe(map(() => undefined)),
      this.menuDeleted$.pipe(map(() => undefined))
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
    this.socket.on('serviceCall', (payload: unknown) => {
      this.serviceCall$.next(payload);
    });
    this.socket.on('serviceCallHandled', (payload: unknown) => {
      this.serviceCallHandled$.next(payload);
    });
    this.socket.on('menu.created', (payload: unknown) => {
      this.menuCreated$.next(payload);
    });
    this.socket.on('menu.updated', (payload: unknown) => {
      this.menuUpdated$.next(payload);
    });
    this.socket.on('menu.deleted', (payload: unknown) => {
      this.menuDeleted$.next(payload);
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
