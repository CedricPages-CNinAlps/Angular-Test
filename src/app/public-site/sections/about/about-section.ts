import { Component, input } from '@angular/core';
import { AboutSectionContent } from '../../../core/models/site-config.model';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';

@Component({
  selector: 'app-about-section',
  imports: [ScrollRevealDirective],
  templateUrl: './about-section.html',
  styleUrl: './about-section.css',
})
export class AboutSection {
  readonly content = input.required<AboutSectionContent>();
}
