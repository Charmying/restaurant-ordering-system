import { Injectable, signal, computed } from '@angular/core';

const TABLE_STORAGE_KEY = 'restaurant_order_table';

@Injectable({
  providedIn: 'root',
})
export class OrderContextService {
  private readonly tableNumber = signal<string | null>(null);
  private readonly token = signal<string | null>(null);

  readonly hasValidContext = computed(
    () => this.tableNumber() !== null && this.tableNumber() !== '' && this.token() !== null && this.token() !== ''
  );

  readonly currentTableNumber = computed(() => this.tableNumber());
  readonly currentToken = computed(() => this.token());

  constructor() {
    this.loadTableFromStorage();
  }

  setFromQueryParams(table: string | number | null, token: string | null): void {
    const t = table !== null && table !== undefined ? String(table) : null;
    this.tableNumber.set(t);
    this.token.set(token ?? null);
    this.persistTableOnly();
  }

  setTableAndToken(tableNumber: string, token: string): void {
    this.tableNumber.set(tableNumber);
    this.token.set(token);
    this.persistTableOnly();
  }

  clearToken(): void {
    this.token.set(null);
  }

  clear(): void {
    this.tableNumber.set(null);
    this.token.set(null);
    try {
      sessionStorage.removeItem(TABLE_STORAGE_KEY);
    } catch {
      // ignore
    }
  }

  getTableNumber(): string | null {
    return this.tableNumber();
  }

  getToken(): string | null {
    return this.token();
  }

  private persistTableOnly(): void {
    const table = this.tableNumber();
    try {
      if (table != null && table !== '') {
        sessionStorage.setItem(TABLE_STORAGE_KEY, table);
      } else {
        sessionStorage.removeItem(TABLE_STORAGE_KEY);
      }
    } catch {
      // ignore
    }
  }

  private loadTableFromStorage(): void {
    try {
      const table = sessionStorage.getItem(TABLE_STORAGE_KEY);
      if (table != null && table !== '') {
        this.tableNumber.set(table);
      }
    } catch {
      sessionStorage.removeItem(TABLE_STORAGE_KEY);
    }
  }
}
