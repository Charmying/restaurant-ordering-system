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
}
