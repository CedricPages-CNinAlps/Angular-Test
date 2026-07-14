import { Component, computed, effect, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FONT_CATALOG, getFontOption } from '../../core/data/fonts-catalog';
import { SiteTheme, TitleStyle } from '../../core/models/site-config.model';
import { DraftConfigStore } from '../../core/services/draft-config.store';
import { ThemeEngineService } from '../../core/services/theme-engine.service';

const TITLE_STYLES: { key: TitleStyle; label: string }[] = [
  { key: 'gradient', label: 'Dégradé' },
  { key: 'underline', label: 'Souligné' },
  { key: 'boxed', label: 'Encadré' },
  { key: 'minimal', label: 'Minimal' },
  { key: 'outline', label: 'Contour' },
];

@Component({
  selector: 'app-theme-editor',
  imports: [FormsModule],
  templateUrl: './theme-editor.html',
  styleUrl: './theme-editor.css',
})
export class ThemeEditor {
  private readonly draftStore = inject(DraftConfigStore);
  private readonly themeEngine = inject(ThemeEngineService);

  readonly theme = computed(() => this.draftStore.draft().theme);
  readonly fonts = FONT_CATALOG;
  readonly titleStyles = TITLE_STYLES;

  readonly previewStyle = computed(() => {
    const t = this.theme();
    const headingFamily = getFontOption(t.fonts.heading).family;
    const bodyFamily = getFontOption(t.fonts.body).family;
    return [
      `--color-primary:${t.colors.primary}`,
      `--color-secondary:${t.colors.secondary}`,
      `--color-accent:${t.colors.accent}`,
      `--color-background:${t.colors.background}`,
      `--color-surface:${t.colors.surface}`,
      `--color-text:${t.colors.text}`,
      `--color-text-muted:${t.colors.textMuted}`,
      `--radius-base:${t.radius}px`,
      `--font-heading:${headingFamily}`,
      `--font-body:${bodyFamily}`,
    ].join(';');
  });

  constructor() {
    effect(() => {
      const t = this.theme();
      this.themeEngine.ensureFontsLoaded([t.fonts.heading, t.fonts.body]);
    });
  }

  updateColor(key: keyof SiteTheme['colors'], value: string): void {
    this.draftStore.updateThemeColors({ [key]: value });
  }

  updateFont(kind: 'heading' | 'body', key: string): void {
    this.draftStore.updateTheme({ fonts: { ...this.theme().fonts, [kind]: key } });
  }

  setTitleStyle(style: TitleStyle): void {
    this.draftStore.updateTheme({ titleStyle: style });
  }

  updateRadius(value: number): void {
    this.draftStore.updateTheme({ radius: value });
  }

  toggleDarkMode(value: boolean): void {
    this.draftStore.updateTheme({ darkMode: value });
  }
}
