import { Directive, HostListener, input, output } from "@angular/core";

@Directive({
  selector: '[wheel]',
  standalone: true
})
export class WheelDirective {
  readonly wheelEnable = input<boolean>(true);
  readonly onWheelUp = output<void>();
  readonly onWheelDown = output<void>();
  readonly onWheel = output<'up' | 'down'>();

  @HostListener('wheel', ['$event'])
  onWhellEvent(event: WheelEvent): void {
    if (!this.wheelEnable()) return;

    event.preventDefault();
    event.stopPropagation();
    event.deltaY < 0 ? this.onWheelUp.emit() : this.onWheelDown.emit();
    this.onWheel.emit(event.deltaY < 0 ? 'up' : 'down');
  }
}