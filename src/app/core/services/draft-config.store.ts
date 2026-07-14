import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { DEFAULT_SITE_CONFIG } from '../data/default-config';
import { SectionConfig, SeoConfig, SiteConfig, SiteTheme } from '../models/site-config.model';
import { JsonBinService } from './json-bin.service';
import { SiteConfigStore } from './site-config.store';

const DRAFT_KEY = 'cv-cms.draft-config';

export interface PublishMessage {
  type: 'success' | 'error';
  text: string;
}

@Injectable({ providedIn: 'root' })
export class DraftConfigStore {
  private readonly siteConfigStore = inject(SiteConfigStore);
  private readonly jsonBin = inject(JsonBinService);

  private readonly _draft = signal<SiteConfig>(this.loadDraft() ?? structuredClone(this.siteConfigStore.config()));
  private readonly _publishing = signal(false);
  private readonly _publishMessage = signal<PublishMessage | null>(null);

  readonly draft = this._draft.asReadonly();
  readonly publishing = this._publishing.asReadonly();
  readonly publishMessage = this._publishMessage.asReadonly();

  readonly isDirty = computed(
    () => JSON.stringify(this._draft()) !== JSON.stringify(this.siteConfigStore.config()),
  );

  constructor() {
    effect(() => {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(this._draft()));
    });
  }

  update(mutate: (draft: SiteConfig) => SiteConfig): void {
    this._draft.set(mutate(structuredClone(this._draft())));
  }

  updateSection(id: string, patch: Record<string, unknown>): void {
    this.update((draft) => {
      const idx = draft.sections.findIndex((s) => s.id === id);
      if (idx >= 0) {
        draft.sections[idx] = { ...draft.sections[idx], ...patch } as SectionConfig;
      }
      return draft;
    });
  }

  updateTheme(patch: Partial<SiteTheme>): void {
    this.update((draft) => {
      draft.theme = { ...draft.theme, ...patch };
      return draft;
    });
  }

  updateThemeColors(patch: Partial<SiteTheme['colors']>): void {
    this.update((draft) => {
      draft.theme = { ...draft.theme, colors: { ...draft.theme.colors, ...patch } };
      return draft;
    });
  }

  updateSeo(patch: Partial<SeoConfig>): void {
    this.update((draft) => {
      draft.seo = { ...draft.seo, ...patch };
      return draft;
    });
  }

  discardDraft(): void {
    this._draft.set(structuredClone(this.siteConfigStore.config()));
  }

  resetToDefault(): void {
    this._draft.set(structuredClone(DEFAULT_SITE_CONFIG));
  }

  async publish(): Promise<boolean> {
    this._publishing.set(true);
    this._publishMessage.set(null);
    try {
      await this.jsonBin.publish(this._draft());
      await this.siteConfigStore.load();
      this._publishMessage.set({ type: 'success', text: 'Site publié avec succès.' });
      return true;
    } catch (err) {
      this._publishMessage.set({
        type: 'error',
        text: err instanceof Error ? err.message : 'Échec de la publication.',
      });
      return false;
    } finally {
      this._publishing.set(false);
    }
  }

  private loadDraft(): SiteConfig | null {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      return raw ? (JSON.parse(raw) as SiteConfig) : null;
    } catch {
      return null;
    }
  }
}
