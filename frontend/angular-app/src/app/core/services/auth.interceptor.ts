import { HttpContextToken, HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, finalize, map, Observable, shareReplay, switchMap, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { API_BASE_URL } from '../config/api.config';

const AUTH_RETRY_CONTEXT = new HttpContextToken<boolean>(() => false);

let refreshInFlight$: Observable<string> | null = null;

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getAccessToken();
  const isApiRequest = req.url.startsWith(API_BASE_URL);
  const isAuthRefreshRequest = req.url === `${API_BASE_URL}/auth/refresh`;
  const wasRetried = req.context.get(AUTH_RETRY_CONTEXT);

  if (!isApiRequest || isAuthRefreshRequest) {
    return next(req);
  }

  const requestWithToken = token
    ? req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    })
    : req;

  return next(requestWithToken).pipe(
    catchError((error: unknown) => {
      if (!(error instanceof HttpErrorResponse) || error.status !== 401 || wasRetried) {
        return throwError(() => error);
      }

      if (!refreshInFlight$) {
        refreshInFlight$ = authService
          .refreshAccessToken()
          .pipe(
            map((session) => session.accessToken),
            shareReplay(1),
            finalize(() => {
              refreshInFlight$ = null;
            }),
          );
      }

      return refreshInFlight$.pipe(
        switchMap((nextToken) =>
          next(
            req.clone({
              context: req.context.set(AUTH_RETRY_CONTEXT, true),
              setHeaders: {
                Authorization: `Bearer ${nextToken}`,
              },
            }),
          ),
        ),
        catchError((refreshError: unknown) => {
          authService.clearSession();
          return throwError(() => refreshError);
        }),
      );
    }),
  );
};
