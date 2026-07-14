import { Component, computed, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AboutSectionContent, AboutStat } from '../../../core/models/site-config.model';
import { DraftConfigStore } from '../../../core/services/draft-config.store';
import { ArrayFieldEditor } from '../shared/array-field-editor';

@Component({
  selector: 'app-about-editor',
  imports: [FormsModule, ArrayFieldEditor],
  templateUrl: './about-editor.html',
})
export class AboutEditor {
  private readonly draftStore = inject(DraftConfigStore);
  readonly sectionId = input.required<string>();

  readonly content = computed(
    () => this.draftStore.draft().sections.find((s) => s.id === this.sectionId()) as AboutSectionContent,
  );

  update(patch: Partial<AboutSectionContent>): void {
    this.draftStore.updateSection(this.sectionId(), patch);
  }

  updateStat(index: number, patch: Partial<AboutStat>): void {
    const stats = [...this.content().stats];
    stats[index] = { ...stats[index], ...patch };
    this.update({ stats });
  }

  addStat(): void {
    const stats = [...this.content().stats, { id: crypto.randomUUID(), label: 'Nouvelle statistique', value: '0' }];
    this.update({ stats });
  }

  removeStat(index: number): void {
    this.update({ stats: this.content().stats.filter((_, i) => i !== index) });
  }

  reorderStats(stats: AboutStat[]): void {
    this.update({ stats });
  }
}
