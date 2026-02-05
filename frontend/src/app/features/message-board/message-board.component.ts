import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MessageBoardService } from './message-board.service';
import { MessageBoardItem } from './message-board.types';
import { ModalComponent } from '../../core/components/modal/modal.component';

@Component({
  selector: 'app-message-board',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, ModalComponent],
  templateUrl: './message-board.component.html',
  styleUrls: ['./message-board.component.scss'],
})
export class MessageBoardComponent {
  private readonly messageService = inject(MessageBoardService);

  /* ========================= State ========================= */

  readonly messages = this.messageService.messages;
  readonly pinnedMessages = this.messageService.pinnedMessages;
  readonly unpinnedMessages = this.messageService.unpinnedMessages;
  readonly stats = this.messageService.stats;

  messageContent = '';
  editingMessage: MessageBoardItem | null = null;
  showDeleteModal = false;
  showDeleteAllModal = false;
  messageToDelete: MessageBoardItem | null = null;

  private readonly currentUser = {
    id: 'local-admin',
    name: 'Admin'
  };

  /* ========================= Actions ========================= */

  sendMessage(): void {
    const content = this.messageContent.trim();
    if (!content) return;

    if (this.editingMessage) {
      this.messageService.updateMessage(this.editingMessage._id, content);
      this.messageContent = '';
      this.editingMessage = null;
      return;
    }

    this.messageService.createMessage(content, this.currentUser.id, this.currentUser.name);
    this.messageContent = '';
  }

  editMessage(message: MessageBoardItem): void {
    this.editingMessage = message;
    this.messageContent = message.content;
  }

  cancelEdit(): void {
    this.editingMessage = null;
    this.messageContent = '';
  }

  togglePinMessage(message: MessageBoardItem): void {
    this.messageService.togglePinMessage(message._id);
  }

  deleteMessage(message: MessageBoardItem): void {
    this.messageToDelete = message;
    this.showDeleteModal = true;
  }

  confirmDelete(): void {
    if (this.messageToDelete) {
      this.messageService.deleteMessage(this.messageToDelete._id);
    }
    this.closeDeleteModal();
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.messageToDelete = null;
  }

  deleteAllMessages(): void {
    this.showDeleteAllModal = true;
  }

  confirmDeleteAll(): void {
    this.messageService.deleteAllMessages();
    this.closeDeleteAllModal();
  }

  closeDeleteAllModal(): void {
    this.showDeleteAllModal = false;
  }
}
