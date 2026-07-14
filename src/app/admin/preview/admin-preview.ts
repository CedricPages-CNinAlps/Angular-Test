import { Component, computed, effect, inject } from '@angular/core';
import { DraftConfigStore } from '../../core/services/draft-config.store';
import { ThemeEngineService } from '../../core/services/theme-engine.service';
import { SectionRenderer } from '../../public-site/section-renderer';

@Component({
  selector: 'app-admin-preview',
  imports: [SectionRenderer],
  templateUrl: './admin-preview.html',
  styleUrl: './admin-preview.css',
})
export class AdminPreview {
  private readonly draftStore = inject(DraftConfigStore);
  private readonly themeEngine = inject(ThemeEngineService);

  readonly sections = computed(() =>
    [...this.draftStore.draft().sections].filter((s) => s.visible).sort((a, b) => a.order - b.order),
  );

  constructor() {
    effect(() => {
      this.themeEngine.apply(this.draftStore.draft().theme);
    });
  }
}
