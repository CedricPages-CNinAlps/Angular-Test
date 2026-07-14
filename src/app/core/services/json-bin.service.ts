import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { SiteConfig } from '../models/site-config.model';
import { TechnicalConfigService } from './technical-config.service';

const API_BASE = 'https://api.jsonbin.io/v3/b';

@Injectable({ providedIn: 'root' })
export class JsonBinService {
  private readonly http = inject(HttpClient);
  private readonly technicalConfig = inject(TechnicalConfigService);

  async fetch(): Promise<SiteConfig> {
    const { binId, accessKey } = this.requireConfig();
    try {
      const res = await firstValueFrom(
        this.http.get<{ record: SiteConfig }>(`${API_BASE}/${binId}/latest`, {
          headers: { 'X-Access-Key': accessKey },
        }),
      );
      return res.record;
    } catch (err) {
      throw new Error(this.describeError(err));
    }
  }

  async publish(config: SiteConfig): Promise<void> {
    const { binId, accessKey } = this.requireConfig();
    try {
      await firstValueFrom(
        this.http.put(`${API_BASE}/${binId}`, config, {
          headers: { 'X-Access-Key': accessKey, 'Content-Type': 'application/json' },
        }),
      );
    } catch (err) {
      throw new Error(this.describeError(err));
    }
  }

  async testConnection(): Promise<{ ok: boolean; message: string }> {
    try {
      await this.fetch();
      return { ok: true, message: 'Connexion réussie : le bin est accessible.' };
    } catch (err) {
      return { ok: false, message: err instanceof Error ? err.message : 'Erreur inconnue.' };
    }
  }

  private requireConfig(): { binId: string; accessKey: string } {
    const { binId, accessKey } = this.technicalConfig.config().jsonBin;
    if (!binId || !accessKey) {
      throw new Error("JSONBin n'est pas configuré (Bin ID / clé manquants).");
    }
    return { binId, accessKey };
  }

  private describeError(err: unknown): string {
    if (err instanceof HttpErrorResponse) {
      if (err.status === 0) return 'Impossible de joindre JSONBin (réseau ou CORS).';
      if (err.status === 401 || err.status === 403) return 'Clé JSONBin invalide ou droits insuffisants.';
      if (err.status === 404) return 'Bin introuvable : vérifiez le Bin ID.';
      return `Erreur JSONBin (HTTP ${err.status}).`;
    }
    return err instanceof Error ? err.message : 'Erreur inconnue.';
  }
}
