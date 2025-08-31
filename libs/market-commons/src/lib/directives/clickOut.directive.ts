import { Directive, ElementRef, HostListener, output } from '@angular/core';

@Directive({
  selector: '[clickOut]',
  standalone: true
})
export class ClickOutDirective {

  constructor(private elementRef: ElementRef) { }

  readonly outside = output<boolean>();

  @HostListener('document:click', ['$event.target'])
  onMouseEnter(targetElement: HTMLElement) {
    const clickedInside = this.elementRef.nativeElement.contains(targetElement);
    if (!clickedInside) {
      this.outside.emit(true);
    }
  }

}
