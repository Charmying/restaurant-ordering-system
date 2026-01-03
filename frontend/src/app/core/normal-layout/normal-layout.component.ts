import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';

@Component({
  selector: 'app-normal-layout',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './normal-layout.component.html',
  styleUrls: ['./normal-layout.component.scss'],
})
export class NormalLayoutComponent {}
