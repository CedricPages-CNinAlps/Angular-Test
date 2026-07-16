import { Injectable, inject, signal } from '@angular/core';
import { TechnicalConfigService } from './technical-config.service';

const SESSION_KEY = 'cv-cms.admin-session';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly technicalConfig = inject(TechnicalConfigService);
  private readonly _authenticated = signal(sessionStorage.getItem(SESSION_KEY) === 'true');
  readonly authenticated = this._authenticated.asReadonly();

  async hash(value: string): Promise<string> {
    const data = new TextEncoder().encode(value);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }

  async setPassword(password: string): Promise<void> {
    const passwordHash = await this.hash(password);
    this.technicalConfig.updateAdmin({ passwordHash });
  }

  async login(email: string, password: string): Promise<boolean> {
    const candidate = await this.hash(password);
    const admin = this.technicalConfig.config().admin;
    const emailOk = email.trim().toLowerCase() === admin.email.trim().toLowerCase();
    const passwordOk = candidate === admin.passwordHash;
    const ok = emailOk && passwordOk;
    if (ok) {
      this._authenticated.set(true);
      sessionStorage.setItem(SESSION_KEY, 'true');
    }
    return ok;
  }

  logout(): void {
    this._authenticated.set(false);
    sessionStorage.removeItem(SESSION_KEY);
  }

  generateToken(): string {
    return crypto.randomUUID().replace(/-/g, '').slice(0, 10);
  }
}
