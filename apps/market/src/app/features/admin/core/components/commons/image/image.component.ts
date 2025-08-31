import { NgClass } from '@angular/common';
import { Component, Input, input } from '@angular/core';

@Component({
  selector: 'image-lazy',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss'],
  imports: [NgClass]
})
export class ImageLazyComponent {
  readonly src = input<string>();
  readonly maxWidth = input<number | string>('', { alias: 'max-width' });
  readonly maxHeight = input<number | string>('', { alias: 'max-height' });
  readonly width = input<number | string>();
  readonly height = input<number | string>();
  readonly position = input<string>();

  load(event: Event): void {
    const path = event.composedPath() as HTMLElement[];
    path[1].classList.remove('img-loading');
  }

  error(event: any): void {
    event.onerror = null;
    event.target.src = './assets/no-photos.png';
  }

}
