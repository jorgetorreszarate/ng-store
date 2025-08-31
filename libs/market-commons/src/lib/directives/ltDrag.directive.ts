import { AfterViewInit, Directive, HostListener, input } from '@angular/core';

class Position {
	x: number; y: number;
	constructor(x: number, y: number) { this.x = x; this.y = y; }
}

@Directive({
	selector: '[appLtDrag]',
	standalone: true
})
export class LtDragDirective implements AfterViewInit {
	readonly dragHandle = input<string>();
	readonly dragTarget = input<string>();

	private moving = false;
	private origin = null;

	// Element to be dragged
	private target: HTMLElement;
	// Drag handle
	private handle: HTMLElement;

	// @HostBinding('style.transform') transform = 'translate3d(0,0,0)';

	public ngAfterViewInit(): void {
		this.target = document.querySelector(this.dragTarget()) as HTMLElement;

		// handle is children item
		if (this.target) {
			this.handle = this.target.querySelector(this.dragHandle()) as HTMLElement;
		}

		// add cursor moving handle
		if (this.handle) {
			this.handle.style.cursor = 'move';
		}
	}

	@HostListener('document:mousemove', ['$event'])
	mousemove(event: MouseEvent) {
		event.preventDefault();
		if (this.moving) {
			this.moveTo(event.clientX, event.clientY);
		}
	}

	@HostListener('document:mouseup')
	mouseup() {
		this.moving = false;
	}

	@HostListener('mousedown', ['$event'])
	onMouseDown(event: MouseEvent) {
		if (event.button === 2 || (this.handle !== undefined && event.target !== this.handle)) {
			return;   // if handle was provided and not clicked, ignore
		} else {
			this.moving = true;
			this.origin = this.getPosition(event.clientX, event.clientY);
		}
	}
	private getPosition(x: number, y: number): Position {
		const transVal: string[] = (this.target && this.target.style.transform || 'translate3d(0,0,0)').split(','); // this.transform.split(',');
		// tslint:disable-next-line:radix
		const newX = parseInt(transVal[0].replace('translate3d(', ''));
		// tslint:disable-next-line:radix
		const newY = parseInt(transVal[1]);
		return new Position(x - newX, y - newY);
	}

	private moveTo(x: number, y: number): void {
		if (this.origin) {
			// this.transform = this.getTranslate((x - this.origin.x), (y - this.origin.y));
			if (this.target) {
				this.target.style.transform = this.getTranslate((x - this.origin.x), (y - this.origin.y));
			}
		}
	}

	private getTranslate(x: number, y: number): string {
		return 'translate3d(' + x + 'px,' + y + 'px,0px)';
	}

}
