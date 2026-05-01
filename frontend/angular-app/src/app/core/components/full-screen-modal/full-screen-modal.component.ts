import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, inject, input, output, ChangeDetectionStrategy } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-full-screen-modal',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './full-screen-modal.component.html',
  styleUrl: './full-screen-modal.component.scss',
  host: {
    '[class.fsm-open]': 'true',
    '[style.position]': '"fixed"',
    '[style.inset]': '"0"',
    '[style.z-index]': '"9999"',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FullScreenModalComponent implements OnInit, AfterViewInit, OnDestroy {
  readonly title = input<string>('');
  readonly showBackButton = input<boolean>(true);
  readonly closeOnBackdropClick = input<boolean>(true);
  readonly showFooterDivider = input<boolean>(true);
  readonly showAnimations = input<boolean>(true);
  readonly close = output<void>();

  private readonly el = inject(ElementRef);
  private previousActiveElement: Element | null = null;

  ngOnInit() {
    this.previousActiveElement = document.activeElement;
    document.body.style.overflow = 'hidden';
  }

  ngAfterViewInit() {
    const dialog = this.el.nativeElement.querySelector('[role="dialog"]') as HTMLElement | null;
    dialog?.focus();
  }

  ngOnDestroy() {
    document.body.style.overflow = '';

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
    const dialog = this.el.nativeElement.querySelector('[role="dialog"]') as HTMLElement | null;
    if (!dialog) return;

    const focusableSelector = [
      'a[href]',
      'area[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'button:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(',');

    const focusable = Array.from(dialog.querySelectorAll<HTMLElement>(focusableSelector)).filter(
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
}
