import { Component, inject, signal, computed, OnInit, ElementRef, HostListener, DestroyRef } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { firstValueFrom } from 'rxjs';
import { ServiceCallService, ServiceCallResponse } from '../../../services/service-call.service';
import { EventsWsService } from '../../../services/events-ws.service';

@Component({
  selector: 'app-service-call-notification',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './service-call-notification.component.html',
  styleUrls: ['./service-call-notification.component.scss'],
})
export class ServiceCallNotificationComponent implements OnInit {
  private readonly serviceCallService = inject(ServiceCallService);
  private readonly eventsWs = inject(EventsWsService);
  private readonly translate = inject(TranslateService);
  private readonly elementRef = inject(ElementRef);
  private readonly destroyRef = inject(DestroyRef);

  private ringTimer: ReturnType<typeof setTimeout> | null = null;

  /* ========================= State ========================= */

  isOpen = signal(false);
  isRinging = signal(false);
  pendingCalls = signal<ServiceCallResponse[]>([]);
  handlingId = signal<string | null>(null);

  /* ========================= Computed ========================= */

  pendingCount = computed(() => this.pendingCalls().length);

  /* ========================= Lifecycle ========================= */

  ngOnInit(): void {
    this.loadPendingCalls();
    this.subscribeToEvents();
  }

  /* ========================= Host Listeners ========================= */

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  }

  /* ========================= Actions ========================= */

  toggleDropdown(): void {
    this.isOpen.update((v) => !v);
    if (this.isOpen()) {
      this.loadPendingCalls();
    }
  }

  async handleCall(id: string, event: Event): Promise<void> {
    event.stopPropagation();
    if (this.handlingId()) return;

    this.handlingId.set(id);
    try {
      await firstValueFrom(this.serviceCallService.handle(id));
      this.pendingCalls.update((calls) => calls.filter((c) => c._id !== id));
    } catch (err) {
      console.error('Failed to handle service call', err);
    } finally {
      this.handlingId.set(null);
    }
  }

  getTimeAgo(createdAt: string): string {
    const diffMs = Date.now() - new Date(createdAt).getTime();
    const mins = Math.floor(diffMs / 60000);

    if (mins < 1) return this.translate.instant('features.serviceCallNotification.time.justNow');
    if (mins < 60) return this.translate.instant('features.serviceCallNotification.time.minutesAgo', { count: mins });
    return this.translate.instant('features.serviceCallNotification.time.hoursAgo', {
      count: Math.floor(mins / 60),
    });
  }

  /* ========================= Private ========================= */

  private async loadPendingCalls(): Promise<void> {
    try {
      const calls = await firstValueFrom(this.serviceCallService.findPending());
      this.pendingCalls.set(calls);
    } catch (err) {
      console.error('Failed to load pending service calls', err);
    }
  }

  private subscribeToEvents(): void {
    this.eventsWs.onServiceCall.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((payload) => {
      const call = payload as ServiceCallResponse;
      this.pendingCalls.update((calls) => {
        if (calls.some((c) => c._id === call._id)) return calls;
        return [...calls, call];
      });
      this.triggerRing();
      this.playNotificationSound();
    });

    this.eventsWs.onServiceCallHandled.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((payload) => {
      const call = payload as ServiceCallResponse;
      this.pendingCalls.update((calls) => calls.filter((c) => c._id !== call._id));
    });
  }

  private triggerRing(): void {
    this.isRinging.set(true);
    if (this.ringTimer) clearTimeout(this.ringTimer);
    this.ringTimer = setTimeout(() => this.isRinging.set(false), 1000);
  }

  private playNotificationSound(): void {
    try {
      const ctx = new AudioContext();

      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.frequency.value = 880;
      gain1.gain.setValueAtTime(0.15, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc1.start(ctx.currentTime);
      osc1.stop(ctx.currentTime + 0.3);

      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.frequency.value = 1320;
      gain2.gain.setValueAtTime(0, ctx.currentTime);
      gain2.gain.setValueAtTime(0.15, ctx.currentTime + 0.15);
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc2.start(ctx.currentTime + 0.15);
      osc2.stop(ctx.currentTime + 0.5);

      setTimeout(() => { ctx.close().catch(() => {}); }, 600);
    } catch {
      // Audio not available — silently fail
    }
  }
}
