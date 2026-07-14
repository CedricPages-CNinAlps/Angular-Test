import { Component, computed, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SkillItem, SkillsSectionContent } from '../../../core/models/site-config.model';
import { DraftConfigStore } from '../../../core/services/draft-config.store';
import { ArrayFieldEditor } from '../shared/array-field-editor';

@Component({
  selector: 'app-skills-editor',
  imports: [FormsModule, ArrayFieldEditor],
  templateUrl: './skills-editor.html',
})
export class SkillsEditor {
  private readonly draftStore = inject(DraftConfigStore);
  readonly sectionId = input.required<string>();

  readonly content = computed(
    () => this.draftStore.draft().sections.find((s) => s.id === this.sectionId()) as SkillsSectionContent,
  );

  update(patch: Partial<SkillsSectionContent>): void {
    this.draftStore.updateSection(this.sectionId(), patch);
  }

  updateSkill(index: number, patch: Partial<SkillItem>): void {
    const skills = [...this.content().skills];
    skills[index] = { ...skills[index], ...patch };
    this.update({ skills });
  }

  addSkill(): void {
    const skills = [
      ...this.content().skills,
      { id: crypto.randomUUID(), name: 'Nouvelle compétence', level: 50, category: 'Général' },
    ];
    this.update({ skills });
  }

  removeSkill(index: number): void {
    this.update({ skills: this.content().skills.filter((_, i) => i !== index) });
  }

  reorderSkills(skills: SkillItem[]): void {
    this.update({ skills });
  }
}
