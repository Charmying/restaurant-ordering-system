import { Injectable, signal, computed, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { MessageBoardItem, MessageBoardState } from './message-board.types';
import { MessageBoardPresenter } from './message-board.presenter';
import { ApiService } from '../../core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class MessageBoardService {
  private readonly api = inject(ApiService);
  private readonly state = signal<MessageBoardState>({
    messages: []
  });

  readonly messages = computed(() => this.state().messages);
  readonly pinnedMessages = computed(() => MessageBoardPresenter.getPinnedMessages(this.state().messages));
  readonly unpinnedMessages = computed(() => MessageBoardPresenter.getUnpinnedMessages(this.state().messages));
  readonly stats = computed(() => ({
    total: this.state().messages.length,
    pinned: this.state().messages.filter(item => item.isPinned).length,
    unpinned: this.state().messages.filter(item => !item.isPinned).length
  }));

  constructor() {
    void this.loadMessages();
  }

  async createMessage(content: string): Promise<void> {
    try {
      const message = await firstValueFrom(
        this.api.post<MessageBoardItem>('/messages', { content })
      );
      this.state.update(current => ({
        ...current,
        messages: [message, ...current.messages]
      }));
    } catch (error) {
      console.error('Failed to create message', error);
    }
  }

  async updateMessage(id: string, content: string): Promise<void> {
    try {
      const updated = await firstValueFrom(
        this.api.put<MessageBoardItem>(`/messages/${id}`, { content })
      );
      this.state.update(current => ({
        ...current,
        messages: current.messages.map(item =>
          item._id === id ? updated : item
        )
      }));
    } catch (error) {
      console.error('Failed to update message', error);
    }
  }

  async togglePinMessage(id: string): Promise<void> {
    const target = this.state().messages.find(item => item._id === id);
    if (!target) return;

    try {
      const updated = await firstValueFrom(
        this.api.put<MessageBoardItem>(`/messages/${id}/${target.isPinned ? 'unpin' : 'pin'}`)
      );
      this.state.update(current => ({
        ...current,
        messages: current.messages.map(item =>
          item._id === id ? updated : item
        )
      }));
    } catch (error) {
      console.error('Failed to toggle pin', error);
    }
  }

  async deleteMessage(id: string): Promise<void> {
    try {
      await firstValueFrom(this.api.delete(`/messages/${id}`));
      this.state.update(current => ({
        ...current,
        messages: current.messages.filter(item => item._id !== id)
      }));
    } catch (error) {
      console.error('Failed to delete message', error);
    }
  }

  async deleteAllMessages(): Promise<void> {
    try {
      await firstValueFrom(this.api.delete('/messages/all'));
      this.state.update(current => ({
        ...current,
        messages: []
      }));
    } catch (error) {
      console.error('Failed to delete all messages', error);
    }
  }

  private async loadMessages(): Promise<void> {
    try {
      const messages = await firstValueFrom(this.api.get<MessageBoardItem[]>('/messages'));
      this.state.update(current => ({
        ...current,
        messages: MessageBoardPresenter.sortByCreatedAtDesc(messages)
      }));
    } catch (error) {
      console.error('Failed to load messages', error);
    }
  }
}
