import { Component } from '@angular/core';
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
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  protected theme = useTheme();

  username = '';
  password = '';
  loginError = '';
  isSubmitting = false;

  constructor(private router: Router, private authService: AuthService) {}

  async login() {
    const username = this.username.trim();
    const password = this.password;
    this.loginError = '';

    if (!username || !password) {
      this.loginError = 'features.login.errors.required';
      return;
    }

    this.isSubmitting = true;
    try {
      await firstValueFrom(this.authService.login(username, password));
      await this.router.navigate(['/dashboard']);
    } catch (error) {
      console.error('Login failed', error);
      this.loginError = 'features.login.errors.invalidCredentials';
    } finally {
      this.isSubmitting = false;
    }
  }
}
