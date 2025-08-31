import { AfterViewInit, Component, ElementRef, Signal, effect, input, signal, viewChild } from '@angular/core';
import { DragScrollDirective, WheelDirective } from '@market-commons';

interface ILimitDrag {
  left: boolean;
  right: boolean;
}

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
  imports: [DragScrollDirective, WheelDirective]
})
export class CarouselComponent implements AfterViewInit {
  readonly length = input<number>(0);
  readonly minHeight = input<string>('auto');
  readonly directionals = input<boolean>(false);
  readonly shadow = input<string>('#fff');
  readonly wheelEnable = input<boolean>(false);
  readonly limit = signal<ILimitDrag>({ left: false, right: false });
  readonly wrapper: Signal<ElementRef<HTMLDivElement>> = viewChild('wrapper');
  readonly ele: Signal<ElementRef<HTMLDivElement>> = viewChild('carousel');

  constructor() {
    effect(() => {
      if (this.length()) {
        setTimeout(() => {
          this.validateLimits();
        }, 10);
      }
    })
  }

  ngAfterViewInit(): void {
    this.wrapper().nativeElement.style.setProperty('--bs-directional-bg', this.shadow());
  }

  get carousel(): HTMLDivElement {
    return this.ele().nativeElement;
  }

  goToLeft(): void {
    this.carousel.scrollLeft -= (this.carousel.offsetWidth / 2 + 10);
    this.validateLimits();
  }

  goToRight(): void {
    this.carousel.scrollLeft += (this.carousel.offsetWidth / 2 + 10);
    this.validateLimits();
  }

  validateLimits(): void {
    this.limit.set({
      left: this.carousel.scrollLeft == 0,
      right: this.carousel.scrollLeft + this.carousel.offsetWidth + 1 >= this.carousel.scrollWidth
    });

    /* console.log(
      this.carousel.scrollLeft,
      this.carousel.scrollLeft + this.carousel.offsetWidth,
      this.carousel.scrollWidth
    ) */
  }

  onWheel(event: 'up' | 'down'): void {
    if (!this.wheelEnable()) return;
    event == 'up' ? this.goToLeft() : this.goToRight();
  }
}
