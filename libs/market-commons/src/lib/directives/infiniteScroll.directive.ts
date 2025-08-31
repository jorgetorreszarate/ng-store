import { Directive, ElementRef, HostListener, output } from '@angular/core';

@Directive({
  selector: '[infinite-scroll]',
  standalone: true
})
export class InfiniteScrollDirective {

  constructor(private elementRef: ElementRef) { }

 readonly track = output<Event>();

  @HostListener('scroll', ['$event'])
  private onScroll($event: Event): void {
    const raw = this.elementRef.nativeElement;

    if (Math.ceil(raw.scrollTop + raw.offsetHeight + 1) >= raw.scrollHeight) {
      this.track.emit($event);
    }
  };

}