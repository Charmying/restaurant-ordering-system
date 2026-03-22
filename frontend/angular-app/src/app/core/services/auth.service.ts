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
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  clearSession(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.userSignal.set(null);
  }

  private persistSession(session: AuthSession): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, session.accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, session.refreshToken);
    localStorage.setItem(this.USER_KEY, JSON.stringify(session.user));
    this.userSignal.set(session.user);
  }

  private loadStoredUser(): AuthUser | null {
    try {
      const raw = localStorage.getItem(this.USER_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as AuthUser;
    } catch (error) {
      console.warn('[Auth] Failed to parse stored user', error);
      return null;
    }
  }
}
