import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent {
  @Input() maxHeight = '90vh';
  @Input() closeOnBackdropClick: boolean = false;
  @Output() close = new EventEmitter<void>();

  onBackdropClick() {
    if (this.closeOnBackdropClick) {
      this.close.emit();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    this.close.emit();
  }
}
