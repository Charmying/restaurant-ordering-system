import { Injectable } from '@angular/core';
import { HttpClient, HttpContext, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface ApiRequestOptions {
  headers?: HttpHeaders | Record<string, string | string[]>;
  params?: HttpParams | Record<string, string | number | boolean | ReadonlyArray<string | number | boolean>>;
  context?: HttpContext;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private readonly http: HttpClient) {}

  get<T>(path: string, options?: ApiRequestOptions): Observable<T> {
    return this.http
      .get<ApiResponse<T>>(this.buildUrl(path), options)
      .pipe(map(this.unwrapResponse), catchError(this.handleError<T>('GET', path)));
  }

  post<T>(path: string, body?: unknown, options?: ApiRequestOptions): Observable<T> {
    return this.http
      .post<ApiResponse<T>>(this.buildUrl(path), body ?? {}, options)
      .pipe(map(this.unwrapResponse), catchError(this.handleError<T>('POST', path)));
  }

  put<T>(path: string, body?: unknown, options?: ApiRequestOptions): Observable<T> {
    return this.http
      .put<ApiResponse<T>>(this.buildUrl(path), body ?? {}, options)
      .pipe(map(this.unwrapResponse), catchError(this.handleError<T>('PUT', path)));
  }

  delete<T>(path: string, options?: ApiRequestOptions): Observable<T> {
    return this.http
      .delete<ApiResponse<T>>(this.buildUrl(path), options)
      .pipe(map(this.unwrapResponse), catchError(this.handleError<T>('DELETE', path)));
  }

  private buildUrl(path: string): string {
    if (/^https?:\/\//i.test(path)) return path;
    if (path.startsWith('/')) return `${API_BASE_URL}${path}`;
    return `${API_BASE_URL}/${path}`;
  }

  private unwrapResponse<T>(response: ApiResponse<T> | T): T {
    if (response && typeof response === 'object' && 'data' in response) {
      return (response as ApiResponse<T>).data;
    }
    return response as T;
  }

  private handleError<T>(method: string, path: string) {
    return (error: unknown) => {
      console.error(`[API] ${method} ${path} failed`, error);
      return throwError(() => error);
    };
  }
}
