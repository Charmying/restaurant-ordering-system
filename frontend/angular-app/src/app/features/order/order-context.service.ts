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
    const sanitizedTable = this.sanitizeTable(table);
    const sanitizedToken = this.sanitizeToken(token);

    this.tableNumber.set(sanitizedTable);
    this.token.set(sanitizedToken);
    this.persistTableOnly();
  }

  setTableAndToken(tableNumber: string, token: string): void {
    this.tableNumber.set(this.sanitizeTable(tableNumber));
    this.token.set(this.sanitizeToken(token));
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
      const sanitizedTable = this.sanitizeTable(table);
      if (sanitizedTable != null && sanitizedTable !== '') {
        this.tableNumber.set(sanitizedTable);
      }
    } catch {
      try {
        sessionStorage.removeItem(TABLE_STORAGE_KEY);
      } catch {
        // ignore
      }
    }
  }

  private sanitizeTable(table: string | number | null | undefined): string | null {
    if (table === null || table === undefined) {
      return null;
    }

    const normalized = String(table).trim();
    if (!/^\d{1,4}$/.test(normalized)) {
      return null;
    }

    return normalized;
  }

  private sanitizeToken(token: string | null | undefined): string | null {
    if (!token) {
      return null;
    }

    const normalized = token.trim();
    if (!/^[A-Za-z0-9_-]{12,512}$/.test(normalized)) {
      return null;
    }

    return normalized;
  }
}
