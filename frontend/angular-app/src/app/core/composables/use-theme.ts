import { inject } from '@angular/core';
import { ThemeService } from '../services';

export const useTheme = () => inject(ThemeService);
