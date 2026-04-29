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

  async login() {
    const username = this.username().trim();
    const password = this.password();
    this.loginError.set('');

    if (!username || !password) {
      this.loginError.set('features.login.errors.required');
      return;
    }

    this.isSubmitting.set(true);
    try {
      await firstValueFrom(this.authService.login(username, password));
      await this.router.navigate(['/dashboard']);
    } catch {
      this.loginError.set('features.login.errors.invalidCredentials');
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
