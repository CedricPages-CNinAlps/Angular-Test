import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { TechnicalConfigService } from '../../core/services/technical-config.service';

@Component({
  selector: 'app-admin-setup',
  imports: [FormsModule],
  templateUrl: './admin-setup.html',
  styleUrl: './admin-auth.css',
})
export class AdminSetup {
  private readonly auth = inject(AuthService);
  private readonly technicalConfig = inject(TechnicalConfigService);
  private readonly router = inject(Router);

  readonly email = signal(this.technicalConfig.config().admin.email);
  readonly password = signal('');
  readonly confirmPassword = signal('');
  readonly error = signal('');
  readonly done = signal(false);
  readonly adminUrl = signal('');
  readonly copied = signal(false);

  async submit(): Promise<void> {
    this.error.set('');
    if (!this.email().trim()) {
      this.error.set("L'e-mail de connexion est requis.");
      return;
    }
    if (this.password().length < 6) {
      this.error.set('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }
    if (this.password() !== this.confirmPassword()) {
      this.error.set('Les mots de passe ne correspondent pas.');
      return;
    }

    const token = this.auth.generateToken();
    await this.auth.setPassword(this.password());
    this.technicalConfig.updateAdmin({ urlToken: token, email: this.email().trim() });
    this.adminUrl.set(`${window.location.origin}/admin/${token}`);
    this.done.set(true);
  }

  async copyUrl(): Promise<void> {
    await navigator.clipboard.writeText(this.adminUrl());
    this.copied.set(true);
  }

  goToAdmin(): void {
    const token = this.technicalConfig.config().admin.urlToken;
    this.router.navigateByUrl(`/admin/${token}/login`);
  }
}
