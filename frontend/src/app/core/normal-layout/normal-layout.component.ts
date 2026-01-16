import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NormalHeaderComponent } from './normal-header/normal-header.component';

@Component({
  selector: 'app-normal-layout',
  standalone: true,
  imports: [RouterOutlet, NormalHeaderComponent],
  templateUrl: './normal-layout.component.html',
  styleUrls: ['./normal-layout.component.scss'],
})
export class NormalLayoutComponent {}
