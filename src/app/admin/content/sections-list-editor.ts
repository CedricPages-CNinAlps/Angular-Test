import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, computed, inject, signal } from '@angular/core';
import { SectionConfig } from '../../core/models/site-config.model';
import { DraftConfigStore } from '../../core/services/draft-config.store';
import {
  isAbout,
  isContact,
  isEducation,
  isExperience,
  isHero,
  isPassions,
  isSkills,
} from '../../core/utils/section-type-guards';
import { AboutEditor } from './editors/about-editor';
import { ContactEditor } from './editors/contact-editor';
import { EducationEditor } from './editors/education-editor';
import { ExperienceEditor } from './editors/experience-editor';
import { HeroEditor } from './editors/hero-editor';
import { PassionsEditor } from './editors/passions-editor';
import { SkillsEditor } from './editors/skills-editor';

const SECTION_TYPE_LABELS: Record<SectionConfig['type'], string> = {
  hero: 'Hero',
  about: 'À propos',
  skills: 'Compétences',
  experience: 'Expériences',
  education: 'Formations',
  passions: 'Passions',
  contact: 'Contact',
};

@Component({
  selector: 'app-sections-list-editor',
  imports: [
    CdkDropList,
    CdkDrag,
    HeroEditor,
    AboutEditor,
    SkillsEditor,
    ExperienceEditor,
    EducationEditor,
    PassionsEditor,
    ContactEditor,
  ],
  templateUrl: './sections-list-editor.html',
  styleUrl: './sections-list-editor.css',
})
export class SectionsListEditor {
  private readonly draftStore = inject(DraftConfigStore);

  readonly typeLabels = SECTION_TYPE_LABELS;
  readonly selectedId = signal<string | null>(null);

  readonly orderedSections = computed<SectionConfig[]>(() =>
    [...this.draftStore.draft().sections].sort((a, b) => a.order - b.order),
  );

  readonly selectedSection = computed<SectionConfig | null>(
    () => this.orderedSections().find((s) => s.id === this.selectedId()) ?? null,
  );

  protected readonly isHero = isHero;
  protected readonly isAbout = isAbout;
  protected readonly isSkills = isSkills;
  protected readonly isExperience = isExperience;
  protected readonly isEducation = isEducation;
  protected readonly isPassions = isPassions;
  protected readonly isContact = isContact;

  select(id: string): void {
    this.selectedId.set(this.selectedId() === id ? null : id);
  }

  toggleVisible(section: SectionConfig, event: Event): void {
    event.stopPropagation();
    this.draftStore.updateSection(section.id, { visible: !section.visible });
  }

  drop(event: CdkDragDrop<SectionConfig[]>): void {
    const ids = this.orderedSections().map((s) => s.id);
    moveItemInArray(ids, event.previousIndex, event.currentIndex);
    this.draftStore.update((draft) => {
      for (const section of draft.sections) {
        section.order = ids.indexOf(section.id);
      }
      return draft;
    });
  }
}
