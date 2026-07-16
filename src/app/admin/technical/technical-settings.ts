import emailjs from '@emailjs/browser';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SeoConfig } from '../../core/models/site-config.model';
import { AuthService } from '../../core/services/auth.service';
import { DraftConfigStore } from '../../core/services/draft-config.store';
import { JsonBinService } from '../../core/services/json-bin.service';
import { TechnicalConfigService } from '../../core/services/technical-config.service';

interface OperationResult {
  ok: boolean;
  message: string;
}

@Component({
  selector: 'app-technical-settings',
  imports: [FormsModule],
  templateUrl: './technical-settings.html',
  styleUrl: './technical-settings.css',
})
export class TechnicalSettings {
  private readonly router = inject(Router);
  private readonly jsonBin = inject(JsonBinService);
  private readonly auth = inject(AuthService);

  readonly technicalConfig = inject(TechnicalConfigService);
  readonly draftStore = inject(DraftConfigStore);

  readonly seo = computed(() => this.draftStore.draft().seo);

  readonly testingConnection = signal(false);
  readonly connectionResult = signal<OperationResult | null>(null);

  readonly testEmailAddress = signal('');
  readonly sendingTestEmail = signal(false);
  readonly testEmailResult = signal<OperationResult | null>(null);

  readonly currentPassword = signal('');
  readonly newPassword = signal('');
  readonly confirmPassword = signal('');
  readonly passwordMessage = signal<OperationResult | null>(null);
  readonly regenerateConfirming = signal(false);

  readonly importError = signal('');

  updateAdminEmail(email: string): void {
    this.technicalConfig.updateAdmin({ email });
  }

  updateJsonBinField(patch: Partial<{ binId: string; accessKey: string }>): void {
    this.technicalConfig.updateJsonBin(patch);
    this.connectionResult.set(null);
  }

  updateEmailJsField(patch: Partial<{ serviceId: string; templateId: string; publicKey: string }>): void {
    this.technicalConfig.updateEmailJs(patch);
    this.testEmailResult.set(null);
  }

  updateSeoField(patch: Partial<SeoConfig>): void {
    this.draftStore.updateSeo(patch);
  }

  async testConnection(): Promise<void> {
    this.testingConnection.set(true);
    this.connectionResult.set(null);
    this.connectionResult.set(await this.jsonBin.testConnection());
    this.testingConnection.set(false);
  }

  async sendTestEmail(): Promise<void> {
    if (!this.testEmailAddress()) return;
    this.sendingTestEmail.set(true);
    this.testEmailResult.set(null);
    const { serviceId, templateId, publicKey } = this.technicalConfig.config().emailJs;
    try {
      await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: 'Test backoffice',
          from_email: this.testEmailAddress(),
          message: 'Ceci est un e-mail de test envoyé depuis le backoffice.',
          to_email: this.testEmailAddress(),
        },
        { publicKey },
      );
      this.testEmailResult.set({ ok: true, message: 'E-mail de test envoyé avec succès.' });
    } catch (err) {
      this.testEmailResult.set({ ok: false, message: err instanceof Error ? err.message : "Échec de l'envoi." });
    } finally {
      this.sendingTestEmail.set(false);
    }
  }

  async changePassword(): Promise<void> {
    this.passwordMessage.set(null);
    const currentHash = await this.auth.hash(this.currentPassword());
    if (currentHash !== this.technicalConfig.config().admin.passwordHash) {
      this.passwordMessage.set({ ok: false, message: 'Mot de passe actuel incorrect.' });
      return;
    }
    if (this.newPassword().length < 6) {
      this.passwordMessage.set({ ok: false, message: 'Le nouveau mot de passe doit contenir au moins 6 caractères.' });
      return;
    }
    if (this.newPassword() !== this.confirmPassword()) {
      this.passwordMessage.set({ ok: false, message: 'Les mots de passe ne correspondent pas.' });
      return;
    }
    await this.auth.setPassword(this.newPassword());
    this.currentPassword.set('');
    this.newPassword.set('');
    this.confirmPassword.set('');
    this.passwordMessage.set({ ok: true, message: 'Mot de passe mis à jour.' });
  }

  regenerateToken(): void {
    if (!this.regenerateConfirming()) {
      this.regenerateConfirming.set(true);
      return;
    }
    const token = this.auth.generateToken();
    this.technicalConfig.updateAdmin({ urlToken: token });
    this.regenerateConfirming.set(false);
    this.router.navigateByUrl(`/admin/${token}`);
  }

  exportTechnicalConfig(): void {
    this.downloadJson('configuration-technique.json', this.technicalConfig.exportBackup());
  }

  exportSiteContent(): void {
    this.downloadJson('contenu-site.json', JSON.stringify(this.draftStore.draft(), null, 2));
  }

  async importTechnicalConfig(event: Event): Promise<void> {
    this.importError.set('');
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    try {
      this.technicalConfig.importBackup(await file.text());
    } catch {
      this.importError.set('Fichier de configuration invalide.');
    }
    (event.target as HTMLInputElement).value = '';
  }

  async importSiteContent(event: Event): Promise<void> {
    this.importError.set('');
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      this.draftStore.update(() => parsed);
    } catch {
      this.importError.set('Fichier de contenu invalide.');
    }
    (event.target as HTMLInputElement).value = '';
  }

  resetToDefault(): void {
    this.draftStore.resetToDefault();
  }

  private downloadJson(filename: string, content: string): void {
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }
}
