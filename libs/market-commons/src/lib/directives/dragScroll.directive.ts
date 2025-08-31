import { AfterViewInit, Directive, ElementRef, EventEmitter, HostBinding, HostListener, Output, output } from "@angular/core";

@Directive({
  selector: '[dragScroll]',
  standalone: true
})
export class DragScrollDirective implements AfterViewInit {
  readonly extremes = output<{ left: boolean, right: boolean }>();
  private dragging: boolean = false;
  private dragElement: HTMLElement;
  container: HTMLElement;
  pos = { top: 0, left: 0, x: 0, y: 0 };

  constructor(
    private element: ElementRef
  ) { }

  ngAfterViewInit(): void {
    this.container = this.element.nativeElement;
    this.validateLimits();
  }

  @HostBinding('class.grabbing') get grabbing() { return this.dragging };
  @HostBinding('style.cursor') get cursor() { return this.dragging ? 'grabbing' : 'inherit' }
  @HostBinding('style.userSelect') userSelect = 'none';

  @HostListener('mousedown', ['$event'])
  @HostListener('touchstart', ['$event'])
  mouseDownHandler(event) {
    this.dragging = true;

    this.dragElement = event.target;

    if (event.touches) {
      const t = event.touches[0];
      event.clientX = t.pageX;
      event.clientY = t.pageY;
    }

    this.pos = {
      left: this.container.scrollLeft,
      top: this.container.scrollTop,
      // Get the current mouse position
      x: event.clientX,
      y: event.clientY,
    };

    // How far the mouse has been moved
    const dx = event.clientX - this.pos.x;
    const dy = event.clientY - this.pos.y;

    // Scroll the element
    this.container.scrollTop = this.pos.top - dy;
    this.container.scrollLeft = this.pos.left - dx;
  };

  @HostListener('mousemove', ['$event'])
  @HostListener('touchmove', ['$event'])
  mouseMoveHandler(event) {
    if (!this.dragging) return;

    this.dragElement.style.pointerEvents = 'none';

    if (event.touches) {
      const t = event.touches[0];
      event.clientX = t.pageX;
      event.clientY = t.pageY;
    }

    // How far the mouse has been moved
    const dx = event.clientX - this.pos.x;
    const dy = event.clientY - this.pos.y;

    // Scroll the element
    this.container.scrollTop = this.pos.top - dy;
    this.container.scrollLeft = this.pos.left - dx;

    this.validateLimits();
  }

  @HostListener('document:mouseup', ['$event'])
  @HostListener('document:touchend', ['$event'])
  mouseUpHandler(event) {
    // Habilita los clics después de que el arrastre ha terminado
    this.dragging = false;

    // Eliminamos el estilo pointer events para que el usuario pueda hacer clic sobre el
    setTimeout(() => {
      this.dragElement && (this.dragElement.style.pointerEvents = null);
    }, 10);
  }

  validateLimits(): void {
    setTimeout(() => {
      this.extremes.emit({
        left: this.container.scrollLeft == 0,
        right: this.container.scrollLeft + this.container.offsetWidth + 1 >= this.container.scrollWidth
      });
    }, 1);
  }

}