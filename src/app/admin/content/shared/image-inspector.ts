import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ImageField } from '../../../core/models/site-config.model';

@Component({
  selector: 'app-image-inspector',
  imports: [FormsModule],
  templateUrl: './image-inspector.html',
  styleUrl: './image-inspector.css',
})
export class ImageInspector {
  readonly image = input.required<ImageField>();
  readonly imageChange = output<ImageField>();

  update(patch: Partial<ImageField>): void {
    this.imageChange.emit({ ...this.image(), ...patch });
  }
}
