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

  readonly menuItems = computed(() => this.menuSignal());

  constructor() {
    void this.loadMenu();
  }

  async loadMenu(): Promise<void> {
    try {
      const items = await firstValueFrom(this.api.get<MenuItem[]>('/menu'));
      const availableItems = items.filter(item => item.available !== false);
      this.menuSignal.set(availableItems);
    } catch (error) {
      console.error('Failed to load menu for ordering', error);
    }
  }

  getById(id: string): MenuItem | undefined {
    return this.menuSignal().find(item => item._id === id);
  }
}
