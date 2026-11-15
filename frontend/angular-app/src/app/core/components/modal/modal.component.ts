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
  private readonly focusableSelector =
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

  ngOnInit() {
    this.previousActiveElement = document.activeElement;
  }

  private static titleCounter = 0;

  ngAfterViewInit() {
    const dialog = this.el.nativeElement.querySelector('[role="dialog"]') as HTMLElement | null;
    if (dialog) {
      const heading = dialog.querySelector('h1, h2, h3, h4, h5, h6') as HTMLElement | null;
      if (heading) {
        if (!heading.id) {
          heading.id = `modal-title-${++ModalComponent.titleCounter}`;
        }
        dialog.setAttribute('aria-labelledby', heading.id);
      }
      dialog.focus();
    }
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

  @HostListener('document:keydown.tab', ['$event'])
  onTab(event: Event): void {
    const keyboardEvent = event as KeyboardEvent;
    const dialog = this.getDialogElement();
    if (!dialog) return;

    const focusable = Array.from(dialog.querySelectorAll<HTMLElement>(this.focusableSelector)).filter(
      (element) => !element.hasAttribute('disabled') && element.tabIndex !== -1,
    );

    if (focusable.length === 0) {
      keyboardEvent.preventDefault();
      dialog.focus();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement as HTMLElement | null;

    if (!active || !dialog.contains(active)) {
      keyboardEvent.preventDefault();
      first.focus();
      return;
    }

    if (keyboardEvent.shiftKey && active === first) {
      keyboardEvent.preventDefault();
      last.focus();
      return;
    }

    if (!keyboardEvent.shiftKey && active === last) {
      keyboardEvent.preventDefault();
      first.focus();
    }
  }

  private getDialogElement(): HTMLElement | null {
    return this.el.nativeElement.querySelector('[role="dialog"]') as HTMLElement | null;
  }
}
