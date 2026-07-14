import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { buildGoogleFontsUrl, getFontOption } from '../data/fonts-catalog';
import { SiteTheme } from '../models/site-config.model';

const FONTS_LINK_ID = 'cv-google-fonts';

@Injectable({ providedIn: 'root' })
export class ThemeEngineService {
  private readonly document = inject(DOCUMENT);
  private lastFontsKey = '';

  apply(theme: SiteTheme): void {
    const root = this.document.documentElement;
    const colors = theme.colors;

    root.style.setProperty('--color-primary', colors.primary);
    root.style.setProperty('--color-secondary', colors.secondary);
    root.style.setProperty('--color-accent', colors.accent);
    root.style.setProperty('--color-background', colors.background);
    root.style.setProperty('--color-surface', colors.surface);
    root.style.setProperty('--color-text', colors.text);
    root.style.setProperty('--color-text-muted', colors.textMuted);
    root.style.setProperty('--radius-base', `${theme.radius}px`);
    root.style.setProperty('--font-heading', getFontOption(theme.fonts.heading).family);
    root.style.setProperty('--font-body', getFontOption(theme.fonts.body).family);

    root.setAttribute('data-title-style', theme.titleStyle);
    root.setAttribute('data-color-scheme', theme.darkMode ? 'dark' : 'light');

    this.ensureFontsLoaded([theme.fonts.heading, theme.fonts.body]);
  }

  ensureFontsLoaded(keys: string[]): void {
    const cacheKey = keys.join('|');
    if (cacheKey === this.lastFontsKey) return;
    this.lastFontsKey = cacheKey;

    let link = this.document.getElementById(FONTS_LINK_ID) as HTMLLinkElement | null;
    if (!link) {
      link = this.document.createElement('link');
      link.id = FONTS_LINK_ID;
      link.rel = 'stylesheet';
      this.document.head.appendChild(link);
    }
    link.href = buildGoogleFontsUrl(keys);
  }
}
