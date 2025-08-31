import { DOCUMENT, NgClass } from '@angular/common';
import { Component, HostListener, OnInit, inject, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ClickOutDirective, SessionService } from '@market-commons';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { SidebarService } from '../sidebar/sidebar.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [ClickOutDirective, FormsModule, ReactiveFormsModule, SearchBarComponent, NgClass, RouterLink]
})
export class HeaderComponent implements OnInit {  
  readonly keywords = new FormControl();
  readonly searchOpen = signal<boolean>(false);
  readonly user = signal<any>(null);

  //Fullscreen
  elem: any;
  readonly isFullScreen = signal<boolean>(false);

  public readonly sidebar = inject(SidebarService);
  private readonly session = inject(SessionService);
  private readonly router = inject(Router);
  private readonly document: any = inject(DOCUMENT);

  ngOnInit(): void {
    this.user.set(this.session.user);

    this.chkScreenMode();
    this.elem = this.document.documentElement;
  }

  clear(): void {
    this.keywords.reset();
    this.searchOpen.set(true);
  }

  signOut(): void {
    this.session.destroy();
    this.router.navigateByUrl('/auth');
  }

  /** Fullscreen mode */
  @HostListener('document:fullscreenchange', ['$event'])
  @HostListener('document:webkitfullscreenchange', ['$event'])
  @HostListener('document:mozfullscreenchange', ['$event'])
  @HostListener('document:MSFullscreenChange', ['$event'])
  fullscreenmodes(event) {
    this.chkScreenMode();
  }

  chkScreenMode() {
    this.isFullScreen.set(!!this.document.fullscreenElement);
  }

  toggleFullscreen(): void {
    this.isFullScreen() ? this.closeFullscreen() : this.openFullscreen();
  }

  openFullscreen() {
    if (this.elem.requestFullscreen) {
      this.elem.requestFullscreen();
    } else if (this.elem.mozRequestFullScreen) {
      /* Firefox */
      this.elem.mozRequestFullScreen();
    } else if (this.elem.webkitRequestFullscreen) {
      /* Chrome, Safari and Opera */
      this.elem.webkitRequestFullscreen();
    } else if (this.elem.msRequestFullscreen) {
      /* IE/Edge */
      this.elem.msRequestFullscreen();
    }
  }

  /* Close fullscreen */
  closeFullscreen() {
    if (this.document.exitFullscreen) {
      this.document.exitFullscreen();
    } else if (this.document.mozCancelFullScreen) {
      /* Firefox */
      this.document.mozCancelFullScreen();
    } else if (this.document.webkitExitFullscreen) {
      /* Chrome, Safari and Opera */
      this.document.webkitExitFullscreen();
    } else if (this.document.msExitFullscreen) {
      /* IE/Edge */
      this.document.msExitFullscreen();
    }
  }

}
