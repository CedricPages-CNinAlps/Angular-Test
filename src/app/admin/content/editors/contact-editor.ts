import { Component, computed, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ContactSectionContent, SocialLink } from '../../../core/models/site-config.model';
import { DraftConfigStore } from '../../../core/services/draft-config.store';
import { ArrayFieldEditor } from '../shared/array-field-editor';

@Component({
  selector: 'app-contact-editor',
  imports: [FormsModule, ArrayFieldEditor],
  templateUrl: './contact-editor.html',
})
export class ContactEditor {
  private readonly draftStore = inject(DraftConfigStore);
  readonly sectionId = input.required<string>();

  readonly content = computed(
    () => this.draftStore.draft().sections.find((s) => s.id === this.sectionId()) as ContactSectionContent,
  );

  update(patch: Partial<ContactSectionContent>): void {
    this.draftStore.updateSection(this.sectionId(), patch);
  }

  updateSocial(index: number, patch: Partial<SocialLink>): void {
    const socials = [...this.content().socials];
    socials[index] = { ...socials[index], ...patch };
    this.update({ socials });
  }

  addSocial(): void {
    const socials = [...this.content().socials, { id: crypto.randomUUID(), label: 'Réseau', url: '', icon: '' }];
    this.update({ socials });
  }

  removeSocial(index: number): void {
    this.update({ socials: this.content().socials.filter((_, i) => i !== index) });
  }

  reorderSocials(socials: SocialLink[]): void {
    this.update({ socials });
  }
}
