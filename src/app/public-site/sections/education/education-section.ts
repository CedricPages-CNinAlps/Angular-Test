import { Component, input } from '@angular/core';
import { EducationSectionContent } from '../../../core/models/site-config.model';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';

@Component({
  selector: 'app-education-section',
  imports: [ScrollRevealDirective],
  templateUrl: './education-section.html',
  styleUrl: './education-section.css',
})
export class EducationSection {
  readonly content = input.required<EducationSectionContent>();
}
