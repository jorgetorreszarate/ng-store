import { DecimalPipe } from '@angular/common';
import { Component, DestroyRef, OnChanges, OnInit, SimpleChanges, inject, input, model, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss'],
  imports: [FormsModule, ReactiveFormsModule, DecimalPipe]
})
export class PaginatorComponent implements OnInit, OnChanges {
  readonly total = input<number>(0);
  readonly size = model<number>(10);
  readonly pages = model<number>(0);
  readonly pageSizes = input<number[]>([5, 10, 20, 50]);
  readonly pagination = output<any>();
  readonly events = output<any>();

  readonly current = signal<number>(1);
  readonly start = signal<number>(0);
  readonly end = signal<number>(0);

  sizeControl = new FormControl();
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.sizeControl.setValue(this.size());

    this.sizeControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(value => {
        this.size.set(value);
        this.current.set(1);
        this.setPagination();
        this.emitEvents();
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.total || changes.size) {
      this.current.set(1);
    }

    this.setPagination();
  }

  emitEvents(): void {
    setTimeout(() => {
      this.events.emit({
        current: this.current(),
        size: this.size()
      });
    }, 0);
  }

  emitValues(): void {
    setTimeout(() => {
      this.pagination.emit({
        current: this.current(),
        pages: this.pages(),
        start: this.start(),
        end: this.end(),
        size: this.size()
      });
    }, 0);
  }

  setPagination(): void {
    const pages = Math.ceil(this.total() / this.size());
    const start = (this.current() - 1) * this.size() + 1;
    const current = this.current();
    let end = current * this.size();

    if (end > this.total()) {
      end = this.total();
    }

    this.pages.set(pages);
    this.start.set(pages ? start : 0);
    this.end.set(end);

    this.emitValues();
  }

  previousPage(): void {
    const current = this.current();
    if (current > 1) {
      this.goToPage(current - 1);
    }
  }

  nextPage(): void {
    const current = this.current();
    const pages = this.pages();
    if (current < pages) {
      this.goToPage(current + 1);
    }
  }

  goToPage(n: number): void {
    if (n > 0) {
      this.current.set(n);
      this.setPagination();
      this.emitEvents();
    }
  }

}
