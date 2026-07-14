export type TitleStyle = 'gradient' | 'underline' | 'boxed' | 'minimal' | 'outline';

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textMuted: string;
}

export interface ThemeFonts {
  heading: string;
  body: string;
}

export interface SiteTheme {
  colors: ThemeColors;
  fonts: ThemeFonts;
  titleStyle: TitleStyle;
  radius: number;
  darkMode: boolean;
}

export interface ImageField {
  url: string;
  width: number | null;
  height: number | null;
  objectFit: 'cover' | 'contain' | 'fill';
  radius: number;
  alt: string;
}

export interface SectionBase {
  id: string;
  order: number;
  visible: boolean;
  navLabel: string;
}

export interface HeroSectionContent extends SectionBase {
  type: 'hero';
  eyebrow: string;
  name: string;
  role: string;
  tagline: string;
  ctaLabel: string;
  ctaTarget: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  photo: ImageField;
}

export interface AboutStat {
  id: string;
  label: string;
  value: string;
}

export interface AboutSectionContent extends SectionBase {
  type: 'about';
  title: string;
  bio: string;
  stats: AboutStat[];
}

export interface SkillItem {
  id: string;
  name: string;
  level: number;
  category: string;
}

export interface SkillsSectionContent extends SectionBase {
  type: 'skills';
  title: string;
  intro: string;
  skills: SkillItem[];
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  period: string;
  location: string;
  description: string;
  tags: string[];
}

export interface ExperienceSectionContent extends SectionBase {
  type: 'experience';
  title: string;
  intro: string;
  items: ExperienceItem[];
}

export interface EducationItem {
  id: string;
  school: string;
  degree: string;
  period: string;
  description: string;
}

export interface EducationSectionContent extends SectionBase {
  type: 'education';
  title: string;
  intro: string;
  items: EducationItem[];
}

export interface PassionItem {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface PassionsSectionContent extends SectionBase {
  type: 'passions';
  title: string;
  intro: string;
  items: PassionItem[];
}

export interface SocialLink {
  id: string;
  label: string;
  url: string;
  icon: string;
}

export interface ContactSectionContent extends SectionBase {
  type: 'contact';
  title: string;
  intro: string;
  email: string;
  phone: string;
  location: string;
  socials: SocialLink[];
}

export type SectionConfig =
  | HeroSectionContent
  | AboutSectionContent
  | SkillsSectionContent
  | ExperienceSectionContent
  | EducationSectionContent
  | PassionsSectionContent
  | ContactSectionContent;

export type SectionType = SectionConfig['type'];

export interface SeoConfig {
  title: string;
  description: string;
  favicon: string;
  ogImage: string;
}

export interface SiteConfig {
  theme: SiteTheme;
  sections: SectionConfig[];
  seo: SeoConfig;
}
