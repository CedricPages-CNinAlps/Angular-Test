import { Component, computed, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EducationItem, EducationSectionContent } from '../../../core/models/site-config.model';
import { DraftConfigStore } from '../../../core/services/draft-config.store';
import { ArrayFieldEditor } from '../shared/array-field-editor';

@Component({
  selector: 'app-education-editor',
  imports: [FormsModule, ArrayFieldEditor],
  templateUrl: './education-editor.html',
})
export class EducationEditor {
  private readonly draftStore = inject(DraftConfigStore);
  readonly sectionId = input.required<string>();

  readonly content = computed(
    () => this.draftStore.draft().sections.find((s) => s.id === this.sectionId()) as EducationSectionContent,
  );

  update(patch: Partial<EducationSectionContent>): void {
    this.draftStore.updateSection(this.sectionId(), patch);
  }

  updateItem(index: number, patch: Partial<EducationItem>): void {
    const items = [...this.content().items];
    items[index] = { ...items[index], ...patch };
    this.update({ items });
  }

  addItem(): void {
    const items = [
      ...this.content().items,
      { id: crypto.randomUUID(), school: 'Établissement', degree: 'Diplôme', period: '', description: '' },
    ];
    this.update({ items });
  }

  removeItem(index: number): void {
    this.update({ items: this.content().items.filter((_, i) => i !== index) });
  }

  reorderItems(items: EducationItem[]): void {
    this.update({ items });
  }
}
