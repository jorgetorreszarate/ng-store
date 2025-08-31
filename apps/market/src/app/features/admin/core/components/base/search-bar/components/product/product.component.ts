import { ImageLazyComponent } from '@admin-core/components/commons';
import { DecimalPipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-search-bar-product',
  imports: [
    RouterLink,
    DecimalPipe,
    ImageLazyComponent
  ],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class SearchBarProductComponent {
  readonly product = input.required<any>();
  readonly selected = output<any>();

  onSelect(): void {
    this.selected.emit(this.product());
  }
}
