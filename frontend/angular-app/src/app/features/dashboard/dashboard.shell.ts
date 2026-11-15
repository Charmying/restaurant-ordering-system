import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DashboardLayout } from './dashboard.layout';

@Component({
  selector: 'app-dashboard-shell',
  standalone: true,
  imports: [RouterOutlet, DashboardLayout],
  templateUrl: './dashboard.shell.html',
  styleUrl: './dashboard.shell.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardShell {}
