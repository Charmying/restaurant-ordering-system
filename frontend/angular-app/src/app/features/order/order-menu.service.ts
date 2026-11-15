import { Injectable, computed, signal, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { MenuItem } from './order.types';

@Injectable({
  providedIn: 'root',
})
export class OrderMenuService {
  private readonly api = inject(ApiService);
  private readonly menuSignal = signal<MenuItem[]>([]);
  private readonly loadingSignal = signal(false);
  private readonly errorSignal = signal<string | null>(null);

  readonly menuItems = computed(() => this.menuSignal());
  readonly isLoading = computed(() => this.loadingSignal());
  readonly errorMessage = computed(() => this.errorSignal());

  constructor() {
    void this.loadMenu();
  }

  async loadMenu(): Promise<void> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    try {
      const items = await firstValueFrom(this.api.get<MenuItem[]>('/menu'));
      const availableItems = items.filter((item) => item.available !== false);
      this.menuSignal.set(availableItems);
    } catch {
      this.menuSignal.set([]);
      this.errorSignal.set('common.loadError');
    } finally {
      this.loadingSignal.set(false);
    }
  }

  getById(id: string): MenuItem | undefined {
    return this.menuSignal().find((item) => item._id === id);
  }
}
