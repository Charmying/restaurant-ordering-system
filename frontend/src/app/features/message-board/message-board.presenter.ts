import { MessageBoardItem } from './message-board.types';

export class MessageBoardPresenter {
  static sortByCreatedAtDesc(items: MessageBoardItem[]): MessageBoardItem[] {
    return [...items].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  static getPinnedMessages(items: MessageBoardItem[]): MessageBoardItem[] {
    return this.sortByCreatedAtDesc(items.filter(item => item.isPinned));
  }

  static getUnpinnedMessages(items: MessageBoardItem[]): MessageBoardItem[] {
    return this.sortByCreatedAtDesc(items.filter(item => !item.isPinned));
  }
}
