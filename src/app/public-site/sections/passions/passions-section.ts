import { Component, input } from '@angular/core';
import { PassionsSectionContent } from '../../../core/models/site-config.model';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';

@Component({
  selector: 'app-passions-section',
  imports: [ScrollRevealDirective],
  templateUrl: './passions-section.html',
  styleUrl: './passions-section.css',
})
export class PassionsSection {
  readonly content = input.required<PassionsSectionContent>();
}
