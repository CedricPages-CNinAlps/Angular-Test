import { Component, input } from '@angular/core';
import { ExperienceSectionContent } from '../../../core/models/site-config.model';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';

@Component({
  selector: 'app-experience-section',
  imports: [ScrollRevealDirective],
  templateUrl: './experience-section.html',
  styleUrl: './experience-section.css',
})
export class ExperienceSection {
  readonly content = input.required<ExperienceSectionContent>();
}
