import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { HeaderComponent } from './core/components/base/header/header.component';
import { SidebarComponent } from './core/components/base/sidebar/sidebar.component';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  imports: [
    HeaderComponent,
    SidebarComponent,
    RouterOutlet
  ]
})
export class AdminComponent implements OnInit {
  readonly offline = signal<boolean>(false);
  readonly destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.verifyConnection();
  }

  verifyConnection(): void {
    fromEvent(window, 'online')
      .pipe(
        debounceTime(250),
        takeUntilDestroyed(this.destroyRef)
      ).subscribe(() => this.offline.set(false));

    fromEvent(window, 'offline')
      .pipe(
        debounceTime(250),
        takeUntilDestroyed(this.destroyRef)
      ).subscribe(() => this.offline.set(true));
  }

}
