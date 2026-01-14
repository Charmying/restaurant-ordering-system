import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { useTheme } from '../../core/composables/use-theme';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  protected theme = useTheme();

  constructor(private router: Router) {}

  login() {
    this.router.navigate(['/dashboard']);
  }
}
