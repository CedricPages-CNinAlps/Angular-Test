import { Injectable, signal } from '@angular/core';
import { EMPTY_TECHNICAL_CONFIG, TechnicalConfig } from '../models/technical-config.model';

const STORAGE_KEY = 'cv-cms.technical-config';

@Injectable({ providedIn: 'root' })
export class TechnicalConfigService {
  private readonly _config = signal<TechnicalConfig>(this.load());
  readonly config = this._config.asReadonly();

  updateJsonBin(patch: Partial<TechnicalConfig['jsonBin']>): void {
    this.persist({ ...this._config(), jsonBin: { ...this._config().jsonBin, ...patch } });
  }

  updateEmailJs(patch: Partial<TechnicalConfig['emailJs']>): void {
    this.persist({ ...this._config(), emailJs: { ...this._config().emailJs, ...patch } });
  }

  updateAdmin(patch: Partial<TechnicalConfig['admin']>): void {
    this.persist({ ...this._config(), admin: { ...this._config().admin, ...patch } });
  }

  isJsonBinConfigured(): boolean {
    const { binId, accessKey } = this._config().jsonBin;
    return binId.trim().length > 0 && accessKey.trim().length > 0;
  }

  isEmailJsConfigured(): boolean {
    const { serviceId, templateId, publicKey } = this._config().emailJs;
    return !!serviceId && !!templateId && !!publicKey;
  }

  exportBackup(): string {
    return JSON.stringify(this._config(), null, 2);
  }

  importBackup(json: string): void {
    const parsed = JSON.parse(json) as Partial<TechnicalConfig>;
    this.persist({
      jsonBin: { ...EMPTY_TECHNICAL_CONFIG.jsonBin, ...parsed.jsonBin },
      emailJs: { ...EMPTY_TECHNICAL_CONFIG.emailJs, ...parsed.emailJs },
      admin: { ...this._config().admin, ...parsed.admin },
    });
  }

  private load(): TechnicalConfig {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return structuredClone(EMPTY_TECHNICAL_CONFIG);
      const parsed = JSON.parse(raw) as Partial<TechnicalConfig>;
      return {
        jsonBin: { ...EMPTY_TECHNICAL_CONFIG.jsonBin, ...parsed.jsonBin },
        emailJs: { ...EMPTY_TECHNICAL_CONFIG.emailJs, ...parsed.emailJs },
        admin: { ...EMPTY_TECHNICAL_CONFIG.admin, ...parsed.admin },
      };
    } catch {
      return structuredClone(EMPTY_TECHNICAL_CONFIG);
    }
  }

  private persist(config: TechnicalConfig): void {
    this._config.set(config);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  }
}
