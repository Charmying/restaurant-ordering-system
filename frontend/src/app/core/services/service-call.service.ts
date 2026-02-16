import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';

export interface ServiceCallResponse {
  _id: string;
  tableNumber: number;
  status: 'pending' | 'handled';
  handledAt?: string;
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class ServiceCallService {
  private readonly api = inject(ApiService);

  create(tableNumber: number) {
    return this.api.post<ServiceCallResponse>('/service-calls', { tableNumber });
  }

  findPending() {
    return this.api.get<ServiceCallResponse[]>('/service-calls/pending');
  }

  handle(id: string) {
    return this.api.put<ServiceCallResponse>(`/service-calls/${id}/handle`);
  }
}
