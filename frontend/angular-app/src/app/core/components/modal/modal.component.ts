import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, inject, input, output, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalComponent implements OnInit, AfterViewInit, OnDestroy {
  readonly maxHeight = input<string>('90vh');
  readonly closeOnBackdropClick = input<boolean>(false);
  readonly close = output<void>();

  private readonly el = inject(ElementRef);
  private previousActiveElement: Element | null = null;

  ngOnInit() {
    this.previousActiveElement = document.activeElement;
  }

  ngAfterViewInit() {
    const dialog = this.el.nativeElement.querySelector('[role="dialog"]') as HTMLElement | null;
    dialog?.focus();
  }

  ngOnDestroy() {
    if (this.previousActiveElement instanceof HTMLElement) {
      this.previousActiveElement.focus();
    }
  }

  onBackdropClick() {
    if (this.closeOnBackdropClick()) {
      this.close.emit();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    this.close.emit();
  }
}
