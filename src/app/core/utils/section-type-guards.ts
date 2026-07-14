import {
  AboutSectionContent,
  ContactSectionContent,
  EducationSectionContent,
  ExperienceSectionContent,
  HeroSectionContent,
  PassionsSectionContent,
  SectionConfig,
  SkillsSectionContent,
} from '../models/site-config.model';

export function isHero(section: SectionConfig): section is HeroSectionContent {
  return section.type === 'hero';
}

export function isAbout(section: SectionConfig): section is AboutSectionContent {
  return section.type === 'about';
}

export function isSkills(section: SectionConfig): section is SkillsSectionContent {
  return section.type === 'skills';
}

export function isExperience(section: SectionConfig): section is ExperienceSectionContent {
  return section.type === 'experience';
}

export function isEducation(section: SectionConfig): section is EducationSectionContent {
  return section.type === 'education';
}

export function isPassions(section: SectionConfig): section is PassionsSectionContent {
  return section.type === 'passions';
}

export function isContact(section: SectionConfig): section is ContactSectionContent {
  return section.type === 'contact';
}
