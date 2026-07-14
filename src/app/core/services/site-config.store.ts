import { Injectable, computed, inject, signal } from '@angular/core';
import { DEFAULT_SITE_CONFIG } from '../data/default-config';
import { SectionConfig, SiteConfig } from '../models/site-config.model';
import { JsonBinService } from './json-bin.service';
import { TechnicalConfigService } from './technical-config.service';

@Injectable({ providedIn: 'root' })
export class SiteConfigStore {
  private readonly jsonBin = inject(JsonBinService);
  private readonly technicalConfig = inject(TechnicalConfigService);

  private readonly _config = signal<SiteConfig>(structuredClone(DEFAULT_SITE_CONFIG));
  private readonly _loading = signal(true);
  private readonly _usingFallback = signal(true);
  private readonly _loadError = signal<string | null>(null);

  readonly config = this._config.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly usingFallback = this._usingFallback.asReadonly();
  readonly loadError = this._loadError.asReadonly();

  readonly theme = computed(() => this._config().theme);
  readonly seo = computed(() => this._config().seo);
  readonly sections = computed<SectionConfig[]>(() =>
    [...this._config().sections].filter((s) => s.visible).sort((a, b) => a.order - b.order),
  );

  async load(): Promise<void> {
    this._loading.set(true);
    this._loadError.set(null);

    if (!this.technicalConfig.isJsonBinConfigured()) {
      this._config.set(structuredClone(DEFAULT_SITE_CONFIG));
      this._usingFallback.set(true);
      this._loading.set(false);
      return;
    }

    try {
      const remote = await this.jsonBin.fetch();
      this._config.set(remote);
      this._usingFallback.set(false);
    } catch (err) {
      this._config.set(structuredClone(DEFAULT_SITE_CONFIG));
      this._usingFallback.set(true);
      this._loadError.set(err instanceof Error ? err.message : 'Erreur de chargement.');
    } finally {
      this._loading.set(false);
    }
  }
}
