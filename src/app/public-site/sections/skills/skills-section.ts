import { Component, computed, input } from '@angular/core';
import { SkillItem, SkillsSectionContent } from '../../../core/models/site-config.model';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';

interface SkillGroup {
  category: string;
  skills: SkillItem[];
}

@Component({
  selector: 'app-skills-section',
  imports: [ScrollRevealDirective],
  templateUrl: './skills-section.html',
  styleUrl: './skills-section.css',
})
export class SkillsSection {
  readonly content = input.required<SkillsSectionContent>();

  readonly groups = computed<SkillGroup[]>(() => {
    const map = new Map<string, SkillItem[]>();
    for (const skill of this.content().skills) {
      const list = map.get(skill.category) ?? [];
      list.push(skill);
      map.set(skill.category, list);
    }
    return Array.from(map.entries()).map(([category, skills]) => ({ category, skills }));
  });
}
