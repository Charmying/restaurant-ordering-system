import { Component, inject, signal, computed, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { ServiceCallService } from '../../../core/services/service-call.service';
import { OrderContextService } from '../order-context.service';

export type BellState = 'idle' | 'sending' | 'success' | 'cooldown';
export type ToastType = 'info' | 'success' | 'error';

@Component({
  selector: 'app-service-bell',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './service-bell.component.html',
  styleUrls: ['./service-bell.component.scss'],
})
export class ServiceBellComponent implements OnDestroy {
  private readonly serviceCallService = inject(ServiceCallService);
  private readonly orderContext = inject(OrderContextService);
  private readonly translate = inject(TranslateService);

  private cooldownTimer: ReturnType<typeof setInterval> | null = null;

  readonly COOLDOWN_SECONDS = 30;

  /* ========================= State ========================= */

  state = signal<BellState>('idle');
  cooldownRemaining = signal(0);
  toast = signal<string | null>(null);
  toastType = signal<ToastType>('info');

  /* ========================= Computed ========================= */

  isVisible = computed(() => this.orderContext.hasValidContext());

  buttonClass = computed(() => {
    switch (this.state()) {
      case 'idle':
        return 'hover:bg-[rgb(var(--surface-elevated))]';
      case 'sending':
        return 'text-[rgb(var(--text-secondary))] cursor-wait';
      case 'success':
        return '';
      case 'cooldown':
        return 'text-[rgb(var(--text-secondary))] opacity-60 cursor-not-allowed';
    }
  });

  toastClass = computed(() => {
    switch (this.toastType()) {
      case 'success':
        return 'bg-[rgb(var(--success))] text-[rgb(var(--success-text))]';
      case 'error':
        return 'bg-[rgb(var(--destructive))] text-white';
      default:
        return 'bg-[rgb(var(--surface-elevated))] text-[rgb(var(--text-primary))] border border-[rgb(var(--surface-muted))]';
    }
  });

  /* ========================= Lifecycle ========================= */

  ngOnDestroy(): void {
    this.clearCooldown();
  }

  /* ========================= Actions ========================= */

  async callService(): Promise<void> {
    if (this.state() !== 'idle') return;

    const tableStr = this.orderContext.getTableNumber();
    if (!tableStr) {
      this.showToast(this.translate.instant('features.serviceBell.tableRequired'), 'error');
      return;
    }

    const tableNumber = parseInt(tableStr, 10);
    if (isNaN(tableNumber)) return;

    this.state.set('sending');
    this.showToast(this.translate.instant('features.serviceBell.calling'), 'info');

    try {
      await firstValueFrom(this.serviceCallService.create(tableNumber));
      this.state.set('success');
      this.showToast(this.translate.instant('features.serviceBell.called'), 'success');

      setTimeout(() => {
        this.state.set('cooldown');
        this.startCooldown();
        this.hideToast();
      }, 2000);
    } catch {
      this.showToast(this.translate.instant('features.serviceBell.callFailed'), 'error');
      setTimeout(() => {
        this.state.set('idle');
        this.hideToast();
      }, 3000);
    }
  }

  /* ========================= Private ========================= */

  private startCooldown(): void {
    this.cooldownRemaining.set(this.COOLDOWN_SECONDS);
    this.cooldownTimer = setInterval(() => {
      this.cooldownRemaining.update((v) => v - 1);
      if (this.cooldownRemaining() <= 0) {
        this.clearCooldown();
        this.state.set('idle');
      }
    }, 1000);
  }

  private clearCooldown(): void {
    if (this.cooldownTimer) {
      clearInterval(this.cooldownTimer);
      this.cooldownTimer = null;
    }
  }

  private showToast(message: string, type: ToastType): void {
    this.toast.set(message);
    this.toastType.set(type);
  }

  private hideToast(): void {
    this.toast.set(null);
  }
}
