import { Component, computed, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PassionItem, PassionsSectionContent } from '../../../core/models/site-config.model';
import { DraftConfigStore } from '../../../core/services/draft-config.store';
import { ArrayFieldEditor } from '../shared/array-field-editor';

@Component({
  selector: 'app-passions-editor',
  imports: [FormsModule, ArrayFieldEditor],
  templateUrl: './passions-editor.html',
})
export class PassionsEditor {
  private readonly draftStore = inject(DraftConfigStore);
  readonly sectionId = input.required<string>();

  readonly content = computed(
    () => this.draftStore.draft().sections.find((s) => s.id === this.sectionId()) as PassionsSectionContent,
  );

  update(patch: Partial<PassionsSectionContent>): void {
    this.draftStore.updateSection(this.sectionId(), patch);
  }

  updateItem(index: number, patch: Partial<PassionItem>): void {
    const items = [...this.content().items];
    items[index] = { ...items[index], ...patch };
    this.update({ items });
  }

  addItem(): void {
    const items = [...this.content().items, { id: crypto.randomUUID(), title: 'Nouvelle passion', description: '', icon: '⭐' }];
    this.update({ items });
  }

  removeItem(index: number): void {
    this.update({ items: this.content().items.filter((_, i) => i !== index) });
  }

  reorderItems(items: PassionItem[]): void {
    this.update({ items });
  }
}
