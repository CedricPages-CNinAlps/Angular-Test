import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DraftConfigStore } from '../../core/services/draft-config.store';
import { SiteConfigStore } from '../../core/services/site-config.store';
import { TechnicalConfigService } from '../../core/services/technical-config.service';

@Component({
  selector: 'app-admin-dashboard',
  imports: [RouterLink],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard {
  readonly draftStore = inject(DraftConfigStore);
  readonly siteConfigStore = inject(SiteConfigStore);
  readonly technicalConfig = inject(TechnicalConfigService);

  readonly totalSections = computed(() => this.draftStore.draft().sections.length);
  readonly visibleSections = computed(() => this.draftStore.draft().sections.filter((s) => s.visible).length);

  readonly jsonBinConfigured = computed(() => this.technicalConfig.isJsonBinConfigured());
  readonly emailJsConfigured = computed(() => this.technicalConfig.isEmailJsConfigured());
  readonly usingFallback = this.siteConfigStore.usingFallback;
}
