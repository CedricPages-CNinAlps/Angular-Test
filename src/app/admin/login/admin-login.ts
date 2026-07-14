import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-login',
  imports: [FormsModule],
  templateUrl: './admin-login.html',
  styleUrl: '../setup/admin-auth.css',
})
export class AdminLogin {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly password = signal('');
  readonly error = signal('');
  readonly loading = signal(false);

  async submit(): Promise<void> {
    this.error.set('');
    this.loading.set(true);
    const ok = await this.auth.login(this.password());
    this.loading.set(false);
    if (!ok) {
      this.error.set('Mot de passe incorrect.');
      return;
    }
    const token = this.route.parent?.snapshot.paramMap.get('token') ?? this.route.snapshot.paramMap.get('token');
    this.router.navigateByUrl(`/admin/${token}`);
  }
}
