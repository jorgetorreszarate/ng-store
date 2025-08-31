import { PRODUCT_SORT } from '@admin-core/constants';
import { DecimalPipe } from '@angular/common';
import { Component, DestroyRef, ElementRef, OnInit, Signal, inject, input, output, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InfiniteScrollDirective, PerfectScrollbarDirective } from '@market-commons';
import { of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, filter, switchMap, tap } from 'rxjs/operators';
import { SearchBarProductComponent } from './components/product/product.component';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    PerfectScrollbarDirective,
    InfiniteScrollDirective,
    DecimalPipe,
    SearchBarProductComponent
  ],
  providers: []
})
export class SearchBarComponent implements OnInit {
  readonly keywords = input<FormControl>();
  readonly selected = output<any>();

  options = PRODUCT_SORT.filter((_, index) => [1, 2, 5].includes(index));
  results: any[] = [];
  form: FormGroup;
  sizePage: number = 12;
  page: number = 1;
  pages: number = 0;
  total: number = 0;
  isLoading: boolean;

  perfectScroll: Signal<ElementRef> = viewChild('perfectScroll');

  private readonly fb = inject(FormBuilder);
  // private readonly productService = inject(ProductService);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.form = this.fb.group({
      keywords: this.keywords(),
      sort: 'coincidencia'
    });

    // this.watchKeywords();
  }

  setSort(item: any): void {
    this.form.get('sort').setValue(item.value);
  }

  /* watchKeywords(): void {
    this.form.valueChanges
      .pipe(
        tap(values => {
          this.page = 1;

          if (!values.keywords) {
            this.results = [];
            this.total = 0;
          }
        }),
        filter((values: any) => values.keywords?.length > 1),
        distinctUntilChanged(),
        tap(() => this.isLoading = true),
        debounceTime(400),
        switchMap((values: any) => {
          return this.productService.paging({
            ...values,
            page: this.page,
            size: this.sizePage,
            flagStock: true
          })
            .pipe(
              catchError(() => {
                this.isLoading = false;
                this.results = [];
                this.total = 0;
                this.pages = 0;
                return of();
              })
            )
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (res: any) => {
          this.isLoading = false;
          if (res) {
            this.total = res.total;
            this.pages = res.pages;
            this.results = res.data;
          }

          this.perfectScroll().nativeElement.scrollTop = 0;
        }
      });
  } */

  onScrollDown() {
    if (!this.isLoading && this.page < this.pages) {
      const params = {
        ...this.form.value,
        page: ++this.page,
        size: this.sizePage,
        flagStock: true
      }

      this.isLoading = true;

      /* this.productService.paging(params)
        .pipe(
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe({
          next: res => {
            this.isLoading = false;
            // this.total = res.total;
            // this.pages = res.pages;
            this.results = [...this.results, ...res.data];
          },
          error: () => {
            this.isLoading = false;
          }
        }); */
    }
  }

  select(product: any): void {
    this.selected.emit(product);
  }

}
