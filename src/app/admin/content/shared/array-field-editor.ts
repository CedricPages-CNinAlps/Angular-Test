import { NgTemplateOutlet } from '@angular/common';
import { Component, TemplateRef, input, output } from '@angular/core';
import { CdkDrag, CdkDragDrop, CdkDragHandle, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';

export interface ArrayFieldTemplateContext<T> {
  $implicit: T;
  index: number;
}

@Component({
  selector: 'app-array-field-editor',
  imports: [CdkDropList, CdkDrag, CdkDragHandle, NgTemplateOutlet],
  templateUrl: './array-field-editor.html',
})
export class ArrayFieldEditor<T> {
  readonly items = input.required<T[]>();
  readonly itemTemplate = input.required<TemplateRef<ArrayFieldTemplateContext<T>>>();
  readonly addLabel = input('Ajouter un élément');
  readonly add = output<void>();
  readonly remove = output<number>();
  readonly reorder = output<T[]>();

  trackByIndex(index: number): number {
    return index;
  }

  onDrop(event: CdkDragDrop<T[]>): void {
    const next = [...this.items()];
    moveItemInArray(next, event.previousIndex, event.currentIndex);
    this.reorder.emit(next);
  }
}
