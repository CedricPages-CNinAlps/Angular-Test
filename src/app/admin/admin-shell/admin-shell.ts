import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { DraftConfigStore } from '../../core/services/draft-config.store';

@Component({
  selector: 'app-admin-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-shell.html',
  styleUrl: './admin-shell.css',
})
export class AdminShell {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly draftStore = inject(DraftConfigStore);
  readonly token = this.route.snapshot.paramMap.get('token');

  logout(): void {
    this.auth.logout();
    this.router.navigateByUrl(`/admin/${this.token}/login`);
  }

  async publish(): Promise<void> {
    await this.draftStore.publish();
  }
}
