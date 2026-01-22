import { Component, EventEmitter, HostListener, Input, Output, HostBinding, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-full-screen-modal',
  standalone: true,
  imports: [],
  templateUrl: './full-screen-modal.component.html',
  styleUrls: ['./full-screen-modal.component.scss'],
  host: {
    '[class.fsm-open]': 'true',
  },
})
export class FullScreenModalComponent implements OnInit, OnDestroy {
  @Input() title: string = '';
  @Input() showBackButton: boolean = true;
  @Input() closeOnBackdropClick: boolean = true;
  @Input() showFooterDivider: boolean = true;
  @Input() showAnimations: boolean = true;
  @Output() close = new EventEmitter<void>();

  @HostBinding('style.position') position = 'fixed';
  @HostBinding('style.inset') inset = '0';
  @HostBinding('style.z-index') zIndex = '9999';

  private previousActiveElement: Element | null = null;

  ngOnInit() {
    this.previousActiveElement = document.activeElement;
    document.body.style.overflow = 'hidden';
  }

  ngOnDestroy() {
    document.body.style.overflow = '';

    if (this.previousActiveElement instanceof HTMLElement) {
      this.previousActiveElement.focus();
    }
  }

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
