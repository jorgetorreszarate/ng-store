import { ISidebarMenu } from '@admin-core/interfaces';
import { NgClass } from '@angular/common';
import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { PerfectScrollbarDirective, SessionService } from '@market-commons';
import { filter } from 'rxjs/operators';
import { menu_list } from './sidebar.constants';
import { SidebarService } from './sidebar.service';
import { UserRol } from '@market/models';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  imports: [NgClass, RouterLink, RouterLinkActive, PerfectScrollbarDirective]
})
export class SidebarComponent implements OnInit {
  readonly options = signal<ISidebarMenu[]>([]);
  private readonly router = inject(Router);
  private readonly session = inject(SessionService);
  public readonly sidebar = inject(SidebarService);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.sidebar.readInitialStatus();

    // Clonamos la lista para no alterar la original
    const list = JSON.parse(JSON.stringify(menu_list));
    this.options.set(this.filterItemsByRoles(list));

    this.selectionItem();
    this.closeInMobile();

    // Nos suscribimos al evento de fin de navegación para identificar el menu activo
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        // this.closeInMobile();
        this.clearSelection();
        this.selectionItem();
      });
  }

  closeInMobile(): void {
    if (window.innerWidth <= 768) {
      this.sidebar.close();
    }
  }

  filterItemsByRoles(sidebar: ISidebarMenu[]): ISidebarMenu[] {
    return sidebar
      .filter(item => !item.roles || this.session.user.hasRole(item.roles as UserRol[]))
      .map(item => {
        if (item.children) item.children = this.filterItemsByRoles(item.children);

        return item;
      });
  }

  selectionItem(): void {
    this.options().forEach(item => {
      if (!item.children) {
        item.selected = this.isActiveRoute(item.url);
      }

      item.children?.forEach(element => {
        const sel = this.isActiveRoute(element.url);
        if (sel) {
          item.selected = sel;
          item.expand = sel;
          element.selected = sel;
        }

      });
    });
  }

  isActiveRoute(url: string) {
    return this.router.isActive(url, {
      paths: 'subset',
      queryParams: 'subset',
      fragment: 'ignored',
      matrixParams: 'ignored'
    });
  }

  toggleMenu(item: ISidebarMenu): void {
    this.options().forEach(x => {
      if (x != item) x.expand = false;
    });
    item.expand = !item.expand;
  }

  clearSelection(): void {
    this.options().forEach(item => {
      item.selected = false;
      item.expand = false;
      item.children?.forEach(el => el.selected = false);
    });
  }

  signOut(): void {
    this.session.destroy();
    this.router.navigateByUrl('/auth');
  }

}
