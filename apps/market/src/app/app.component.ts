import { CommonModule, DOCUMENT } from '@angular/common';
import { AfterViewInit, Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  lb: any = {
    percent: 0
  };

  private readonly router = inject(Router);
  private readonly document: Document = inject(DOCUMENT);

  constructor() {
    this.router.events
      .pipe(takeUntilDestroyed())
      .subscribe((event: any) => {
        switch (true) {
          case event instanceof NavigationStart:
            // this.loading = true;
            this.lb.percent = Math.random() * 30 + 30;
            this.lb.interval = setInterval(() => {
              this.lb.percent = Math.random() * ((100 - this.lb.percent) / 2) + this.lb.percent;
            }, 100);
            break;

          case event instanceof NavigationEnd:
          case event instanceof NavigationCancel:
          case event instanceof NavigationError:
            // this.loading = false;
            clearInterval(this.lb.interval);
            setTimeout(() => {
              this.lb.percent = 100;
              setTimeout(() => this.lb.percent = 0, 500);
            }, 100);

            break;
        }
      });
  }

  ngAfterViewInit(): void {
    const el = this.document.querySelector('.page-loader');
    el?.classList.add('hidden');
  }
}
