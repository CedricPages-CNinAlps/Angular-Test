import { Component, input } from '@angular/core';
import { SectionConfig } from '../core/models/site-config.model';
import {
  isAbout,
  isContact,
  isEducation,
  isExperience,
  isHero,
  isPassions,
  isSkills,
} from '../core/utils/section-type-guards';
import { AboutSection } from './sections/about/about-section';
import { ContactSection } from './sections/contact/contact-section';
import { EducationSection } from './sections/education/education-section';
import { ExperienceSection } from './sections/experience/experience-section';
import { HeroSection } from './sections/hero/hero-section';
import { PassionsSection } from './sections/passions/passions-section';
import { SkillsSection } from './sections/skills/skills-section';

@Component({
  selector: 'app-section-renderer',
  imports: [HeroSection, AboutSection, SkillsSection, ExperienceSection, EducationSection, PassionsSection, ContactSection],
  template: `
    @let section = this.section();
    @if (isHero(section)) {
      <app-hero-section [content]="section" />
    } @else if (isAbout(section)) {
      <app-about-section [content]="section" />
    } @else if (isSkills(section)) {
      <app-skills-section [content]="section" />
    } @else if (isExperience(section)) {
      <app-experience-section [content]="section" />
    } @else if (isEducation(section)) {
      <app-education-section [content]="section" />
    } @else if (isPassions(section)) {
      <app-passions-section [content]="section" />
    } @else if (isContact(section)) {
      <app-contact-section [content]="section" />
    }
  `,
})
export class SectionRenderer {
  readonly section = input.required<SectionConfig>();

  protected readonly isHero = isHero;
  protected readonly isAbout = isAbout;
  protected readonly isSkills = isSkills;
  protected readonly isExperience = isExperience;
  protected readonly isEducation = isEducation;
  protected readonly isPassions = isPassions;
  protected readonly isContact = isContact;
}
