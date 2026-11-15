import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { useTheme } from '../../core/composables/use-theme';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [TranslateModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  protected theme = useTheme();
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  readonly username = signal('');
  readonly password = signal('');
  readonly loginError = signal('');
  readonly isSubmitting = signal(false);

  private readonly USERNAME_REGEX = /^[A-Za-z0-9_-]{3,32}$/;

  async login() {
    const username = this.username().trim();
    const password = this.password();
    this.loginError.set('');

    if (!username || !password) {
      this.loginError.set('features.login.errors.required');
      return;
    }

    if (!this.USERNAME_REGEX.test(username) || password.length < 8 || password.length > 128) {
      this.loginError.set('features.login.errors.invalidCredentials');
      return;
    }

    this.isSubmitting.set(true);
    try {
      await firstValueFrom(this.authService.login(username, password));
      await this.router.navigate(['/dashboard']);
    } catch (error) {
      const body =
        error && typeof error === 'object' && 'error' in error
          ? (error as { error?: { message?: string } }).error
          : null;
      const message = body?.message;
      this.loginError.set(
        message === 'Invalid credentials' ? 'features.login.errors.invalidCredentials' : 'common.error',
      );
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
