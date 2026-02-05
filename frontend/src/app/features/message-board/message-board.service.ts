import { Injectable, signal, computed } from '@angular/core';
import { MessageBoardItem, MessageBoardState } from './message-board.types';
import { MockMessageBoardItems } from './message-board.mock';
import { MessageBoardPresenter } from './message-board.presenter';

@Injectable({
  providedIn: 'root'
})
export class MessageBoardService {
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
    this.loadMessages();
  }

  createMessage(content: string, userId: string, username: string): void {
    const now = new Date().toISOString();
    const message: MessageBoardItem = {
      _id: this.generateId(),
      userId,
      username,
      content,
      isPinned: false,
      createdAt: now,
      updatedAt: now,
      __v: 0
    };

    this.state.update(current => ({
      ...current,
      messages: [message, ...current.messages]
    }));
  }

  updateMessage(id: string, content: string): void {
    const now = new Date().toISOString();
    this.state.update(current => ({
      ...current,
      messages: current.messages.map(item =>
        item._id === id ? { ...item, content, updatedAt: now } : item
      )
    }));
  }

  togglePinMessage(id: string): void {
    this.state.update(current => ({
      ...current,
      messages: current.messages.map(item =>
        item._id === id ? { ...item, isPinned: !item.isPinned } : item
      )
    }));
  }

  deleteMessage(id: string): void {
    this.state.update(current => ({
      ...current,
      messages: current.messages.filter(item => item._id !== id)
    }));
  }

  deleteAllMessages(): void {
    this.state.update(current => ({
      ...current,
      messages: []
    }));
  }

  private loadMessages(): void {
    this.state.update(current => ({
      ...current,
      messages: MessageBoardPresenter.sortByCreatedAtDesc(MockMessageBoardItems)
    }));
  }

  private generateId(): string {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return crypto.randomUUID();
    }
    return Math.random().toString(36).slice(2, 12);
  }
}
