import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MessageBoardService } from './message-board.service';
import { AuthService } from '../../core/services/auth.service';
import { MessageBoardItem } from './message-board.types';
import { ModalComponent } from '../../core/components/modal/modal.component';

@Component({
  selector: 'app-message-board',
  standalone: true,
  imports: [FormsModule, TranslateModule, ModalComponent, DatePipe],
  templateUrl: './message-board.component.html',
  styleUrl: './message-board.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageBoardComponent {
  private readonly messageService = inject(MessageBoardService);
  private readonly authService = inject(AuthService);

  /* ========================= State ========================= */

  readonly messages = this.messageService.messages;
  readonly pinnedMessages = this.messageService.pinnedMessages;
  readonly unpinnedMessages = this.messageService.unpinnedMessages;
  readonly stats = this.messageService.stats;

  readonly messageContent = signal('');
  readonly editingMessage = signal<MessageBoardItem | null>(null);
  readonly showDeleteModal = signal(false);
  readonly showDeleteAllModal = signal(false);
  readonly messageToDelete = signal<MessageBoardItem | null>(null);

  private get isAuthenticated(): boolean {
    return !!this.authService.user();
  }

  /* ========================= Actions ========================= */

  sendMessage(): void {
    const content = this.messageContent().trim();
    if (!content) return;
    if (!this.isAuthenticated) return;

    const editingMsg = this.editingMessage();
    if (editingMsg) {
      this.messageService.updateMessage(editingMsg._id, content);
      this.messageContent.set('');
      this.editingMessage.set(null);
      return;
    }

    this.messageService.createMessage(content);
    this.messageContent.set('');
  }

  editMessage(message: MessageBoardItem): void {
    this.editingMessage.set(message);
    this.messageContent.set(message.content);
  }

  cancelEdit(): void {
    this.editingMessage.set(null);
    this.messageContent.set('');
  }

  togglePinMessage(message: MessageBoardItem): void {
    this.messageService.togglePinMessage(message._id);
  }

  deleteMessage(message: MessageBoardItem): void {
    this.messageToDelete.set(message);
    this.showDeleteModal.set(true);
  }

  confirmDelete(): void {
    const toDelete = this.messageToDelete();
    if (toDelete) {
      this.messageService.deleteMessage(toDelete._id);
    }
    this.closeDeleteModal();
  }

  closeDeleteModal(): void {
    this.showDeleteModal.set(false);
    this.messageToDelete.set(null);
  }

  deleteAllMessages(): void {
    this.showDeleteAllModal.set(true);
  }

  confirmDeleteAll(): void {
    this.messageService.deleteAllMessages();
    this.closeDeleteAllModal();
  }

  closeDeleteAllModal(): void {
    this.showDeleteAllModal.set(false);
  }
}
