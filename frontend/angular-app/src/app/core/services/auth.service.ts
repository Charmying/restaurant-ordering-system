import { Injectable, computed, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiService } from './api.service';

export type AuthRole = 'employee' | 'manager' | 'superadmin';

export interface AuthUser {
  userId: string;
  username: string;
  role: AuthRole;
}

export interface AuthSession {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly ACCESS_TOKEN_KEY = 'restaurant_access_token';
  private readonly REFRESH_TOKEN_KEY = 'restaurant_refresh_token';
  private readonly USER_KEY = 'restaurant_user';

  private readonly userSignal = signal<AuthUser | null>(this.loadStoredUser());
  readonly user = computed(() => this.userSignal());

  constructor(private readonly api: ApiService) {}

  login(username: string, password: string): Observable<AuthSession> {
    return this.api.post<AuthSession>('/auth/login', { username, password }).pipe(
      tap((session) => {
        this.persistSession(session);
      }),
    );
  }

  logout(): Observable<{ message: string }> {
    return this.api.post<{ message: string }>('/auth/logout', {}).pipe(
      tap(() => {
        this.clearSession();
      }),
    );
  }

  getAccessToken(): string | null {
    return this.readLocalStorage(this.ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return this.readLocalStorage(this.REFRESH_TOKEN_KEY);
  }

  refreshAccessToken(): Observable<AuthSession> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('Missing refresh token');
    }

    return this.api.post<AuthSession>('/auth/refresh', { refreshToken }).pipe(
      tap((session) => {
        this.persistSession(session);
      }),
    );
  }

  clearSession(): void {
    this.removeLocalStorage(this.ACCESS_TOKEN_KEY);
    this.removeLocalStorage(this.REFRESH_TOKEN_KEY);
    this.removeLocalStorage(this.USER_KEY);
    this.userSignal.set(null);
  }

  private persistSession(session: AuthSession): void {
    this.writeLocalStorage(this.ACCESS_TOKEN_KEY, session.accessToken);
    this.writeLocalStorage(this.REFRESH_TOKEN_KEY, session.refreshToken);
    this.writeLocalStorage(this.USER_KEY, JSON.stringify(session.user));
    this.userSignal.set(session.user);
  }

  private loadStoredUser(): AuthUser | null {
    try {
      const raw = this.readLocalStorage(this.USER_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  }

  private readLocalStorage(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  private writeLocalStorage(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch {
      // Ignore storage failures to avoid breaking the UI in private mode.
    }
  }

  private removeLocalStorage(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch {
      // Ignore storage failures to keep logout flows resilient.
    }
  }
}
