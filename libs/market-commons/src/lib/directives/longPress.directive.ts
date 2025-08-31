import { Directive, HostBinding, HostListener, output } from "@angular/core";
import { Subscription, interval, switchMap, takeWhile, timer } from "rxjs";

@Directive({
  selector: '[long-press]',
  standalone: true
})
export class LongPressDirective {
  private _pressing: boolean = false;
  private _longPressing: boolean = false;
  private subscription: Subscription;

  readonly onLongPress = output<any>();
  readonly onLongPressing = output<any>();

  @HostBinding('class.press')
  get press() { return this._pressing; }

  @HostBinding('class.longpress')
  get longPress() { return this._longPressing; }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event) {
    if (event.button !== 0) return;

    this._pressing = true;
    this._longPressing = false;

    this.subscription?.unsubscribe();

    this.subscription = timer(300)
      .pipe(
        switchMap(() => {
          this._longPressing = true;
          this.onLongPress.emit(event);

          return interval(50)
            .pipe(takeWhile(() => this._longPressing));
        })
      )
      .subscribe(() => {
        this.onLongPressing.emit(event);
      });
  }

  @HostListener('mouseup')
  onMouseUp = () => this.endPress()

  @HostListener('mouseleave')
  onMouseLeave = () => this.endPress()

  endPress() {
    this.subscription?.unsubscribe();
    this._longPressing = false;
    this._pressing = false;
  }

}