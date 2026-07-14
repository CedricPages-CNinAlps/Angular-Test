import { Directive, ElementRef, HostListener, inject } from '@angular/core';

@Directive({
  selector: '[appMagnetic]',
})
export class MagneticDirective {
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (this.reduceMotion) return;
    const rect = this.el.nativeElement.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    this.el.nativeElement.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.el.nativeElement.style.transform = '';
  }
}
