import { Component, computed, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ExperienceItem, ExperienceSectionContent } from '../../../core/models/site-config.model';
import { DraftConfigStore } from '../../../core/services/draft-config.store';
import { ArrayFieldEditor } from '../shared/array-field-editor';

@Component({
  selector: 'app-experience-editor',
  imports: [FormsModule, ArrayFieldEditor],
  templateUrl: './experience-editor.html',
})
export class ExperienceEditor {
  private readonly draftStore = inject(DraftConfigStore);
  readonly sectionId = input.required<string>();

  readonly content = computed(
    () => this.draftStore.draft().sections.find((s) => s.id === this.sectionId()) as ExperienceSectionContent,
  );

  update(patch: Partial<ExperienceSectionContent>): void {
    this.draftStore.updateSection(this.sectionId(), patch);
  }

  updateItem(index: number, patch: Partial<ExperienceItem>): void {
    const items = [...this.content().items];
    items[index] = { ...items[index], ...patch };
    this.update({ items });
  }

  updateTags(index: number, raw: string): void {
    const tags = raw
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);
    this.updateItem(index, { tags });
  }

  tagsText(item: ExperienceItem): string {
    return item.tags.join(', ');
  }

  addItem(): void {
    const items = [
      ...this.content().items,
      {
        id: crypto.randomUUID(),
        company: 'Nouvelle entreprise',
        role: 'Intitulé du poste',
        period: '',
        location: '',
        description: '',
        tags: [],
      },
    ];
    this.update({ items });
  }

  removeItem(index: number): void {
    this.update({ items: this.content().items.filter((_, i) => i !== index) });
  }

  reorderItems(items: ExperienceItem[]): void {
    this.update({ items });
  }
}
