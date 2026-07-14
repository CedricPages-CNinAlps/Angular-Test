import { Component, input } from '@angular/core';
import { HeroSectionContent } from '../../../core/models/site-config.model';
import { MagneticDirective } from '../../directives/magnetic.directive';

@Component({
  selector: 'app-hero-section',
  imports: [MagneticDirective],
  templateUrl: './hero-section.html',
  styleUrl: './hero-section.css',
})
export class HeroSection {
  readonly content = input.required<HeroSectionContent>();

  get nameLetters(): string[] {
    return this.content().name.split('');
  }
}
