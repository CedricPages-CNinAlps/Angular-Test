import { Meta, Title } from '@angular/platform-browser';
import { Component, OnDestroy, effect, inject, signal } from '@angular/core';
import { SiteConfigStore } from '../../core/services/site-config.store';
import { ThemeEngineService } from '../../core/services/theme-engine.service';
import { SectionRenderer } from '../section-renderer';

@Component({
  selector: 'app-public-shell',
  imports: [SectionRenderer],
  templateUrl: './public-shell.html',
  styleUrl: './public-shell.css',
})
export class PublicShell implements OnDestroy {
  private readonly siteConfigStore = inject(SiteConfigStore);
  private readonly themeEngine = inject(ThemeEngineService);
  private readonly titleService = inject(Title);
  private readonly meta = inject(Meta);

  readonly sections = this.siteConfigStore.sections;
  readonly loading = this.siteConfigStore.loading;
  readonly activeSectionId = signal('');
  readonly navOpen = signal(false);
  readonly currentYear = new Date().getFullYear();

  private observer?: IntersectionObserver;

  constructor() {
    effect(() => {
      this.themeEngine.apply(this.siteConfigStore.theme());
    });

    effect(() => {
      const seo = this.siteConfigStore.seo();
      this.titleService.setTitle(seo.title || 'CV');
      this.meta.updateTag({ name: 'description', content: seo.description || '' });
    });

    effect(() => {
      const ids = this.sections().map((s) => s.id);
      queueMicrotask(() => this.setupObserver(ids));
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  closeNav(): void {
    this.navOpen.set(false);
  }

  private setupObserver(ids: string[]): void {
    this.observer?.disconnect();
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    if (!elements.length) return;

    this.observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          this.activeSectionId.set(visible[0].target.id);
        }
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    for (const el of elements) this.observer.observe(el);
  }
}
