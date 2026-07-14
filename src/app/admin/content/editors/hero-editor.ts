import { Component, computed, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HeroSectionContent, ImageField } from '../../../core/models/site-config.model';
import { DraftConfigStore } from '../../../core/services/draft-config.store';
import { ImageInspector } from '../shared/image-inspector';

@Component({
  selector: 'app-hero-editor',
  imports: [FormsModule, ImageInspector],
  templateUrl: './hero-editor.html',
})
export class HeroEditor {
  private readonly draftStore = inject(DraftConfigStore);
  readonly sectionId = input.required<string>();

  readonly content = computed(
    () => this.draftStore.draft().sections.find((s) => s.id === this.sectionId()) as HeroSectionContent,
  );

  update(patch: Partial<HeroSectionContent>): void {
    this.draftStore.updateSection(this.sectionId(), patch);
  }

  updatePhoto(photo: ImageField): void {
    this.update({ photo });
  }
}
