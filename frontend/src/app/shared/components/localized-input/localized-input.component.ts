import { Component, Input, Output, EventEmitter, forwardRef, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { LocalizedString, SupportedLanguage, SUPPORTED_LANGUAGES, LANGUAGE_LABELS } from '../../types/i18n.types';
import { createEmptyLocalizedString } from '../../utils/i18n.util';
import { useTheme } from '../../../core/composables/use-theme';

@Component({
  selector: 'app-localized-input',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './localized-input.component.html',
  styleUrls: ['./localized-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => LocalizedInputComponent),
      multi: true,
    },
  ],
})
export class LocalizedInputComponent implements ControlValueAccessor {
  protected readonly theme = useTheme();

  /* ========================= Inputs & Outputs ========================= */

  @Input() label: string | null = null;
  @Input() placeholder: LocalizedString = createEmptyLocalizedString();
  @Input() required = false;
  @Input() disabled = false;
  @Input() inputType: 'text' | 'textarea' = 'text';
  @Input() rows = 3;
  @Input() helpText: string | null = null;
  @Input() errorMessage: string | null = null;
  @Input() maxLength: number | null = null;

  @Output() valueChange = new EventEmitter<LocalizedString>();
  @Output() blur = new EventEmitter<void>();
  @Output() focus = new EventEmitter<void>();

  /* ========================= State ========================= */

  protected readonly value = signal<LocalizedString>(createEmptyLocalizedString());
  protected readonly activeTab = signal<SupportedLanguage>('zh');
  protected readonly isFocused = signal(false);
  protected readonly characterCount = signal(0);

  protected readonly languages = computed(() => SUPPORTED_LANGUAGES);
  protected readonly languageLabels = computed(() => LANGUAGE_LABELS);
  protected readonly currentValue = computed(() => this.value()[this.activeTab()]);
  protected readonly hasError = computed(() => !!this.errorMessage);
  protected readonly isEmpty = computed(
    () => !this.value().zh?.trim() && !this.value().en?.trim()
  );
  protected readonly showCharacterCount = computed(
    () => this.maxLength !== null && this.maxLength > 0
  );

  /* ========================= Private ========================= */

  private onChange: (value: LocalizedString) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    effect(() => {
      this.characterCount.set(this.currentValue()?.length || 0);
    });
  }

  /* ========================= CSS Class Generators ========================= */

  protected getTabClass(lang: SupportedLanguage): string {
    const isActive = lang === this.activeTab();
    const baseClass = 'relative px-4 py-2 text-sm font-medium transition-colors duration-200 cursor-pointer';

    if (isActive) return `${baseClass} text-[rgb(var(--accent))]`;

    return `${baseClass} text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-primary))]`;
  }

  protected getIndicatorClass(lang: SupportedLanguage): string {
    const isActive = lang === this.activeTab();
    return isActive ? 'absolute bottom-0 left-0 right-0 h-0.5 bg-[rgb(var(--accent))] transition-all duration-300' : '';
  }

  protected getInputWrapperClass(): string {
    const base = 'relative w-full rounded-lg overflow-hidden border transition-all duration-200';
    const background = 'bg-[rgb(var(--surface))]';

    if (this.disabled) return `${base} ${background} border-[rgb(var(--surface-muted))] opacity-60 cursor-not-allowed`;
    if (this.hasError()) return `${base} ${background} border-[rgb(var(--destructive))] focus-within:ring-2 focus-within:ring-[rgb(var(--destructive))]/30`;
    if (this.isFocused()) return `${base} ${background} border-[rgb(var(--accent))] ring-2 ring-[rgb(var(--accent))]/20`;

    return `${base} ${background} border-[rgb(var(--border))]`;
  }

  protected getLabelClass(): string {
    if (this.required) return 'flex items-center gap-1 text-sm font-medium text-[rgb(var(--text-primary))]';

    return 'text-sm font-medium text-[rgb(var(--text-primary))]';
  }

  protected getHelpTextClass(): string {
    return this.hasError() ? 'text-xs text-[rgb(var(--destructive))]' : 'text-xs text-[rgb(var(--text-secondary))]';
  }

  protected getCharacterCountClass(): string {
    const isNearLimit = this.characterCount() > (this.maxLength || 0) * 0.8;
    const isOverLimit = this.characterCount() > (this.maxLength || 0);

    if (isOverLimit) return 'text-[rgb(var(--destructive))]';
    if (isNearLimit) return 'text-[rgb(var(--accent))]';

    return 'text-[rgb(var(--text-secondary))]';
  }

  protected getPlaceholder(): string {
    const lang = this.activeTab();
    return this.placeholder[lang] || '';
  }

  /* ========================= Event Handlers ========================= */

  protected switchLanguage(lang: SupportedLanguage): void {
    if (!this.disabled) {
      this.activeTab.set(lang);
    }
  }

  protected onInputChange(target: HTMLInputElement | HTMLTextAreaElement): void {
    const newValue = target.value;
    const updated = { ...this.value(), [this.activeTab()]: newValue };
    this.value.set(updated);
    this.onChange(updated);
    this.valueChange.emit(updated);
  }

  protected onInputFocus(): void {
    this.isFocused.set(true);
    this.focus.emit();
  }

  protected onInputBlur(): void {
    this.isFocused.set(false);
    this.onTouched();
    this.blur.emit();
  }

  /* ========================= ControlValueAccessor Implementation ========================= */

  writeValue(value: LocalizedString | null): void {
    this.value.set(value || createEmptyLocalizedString());
  }

  registerOnChange(fn: (value: LocalizedString) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
