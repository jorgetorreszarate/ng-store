import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  standalone: true
})
export class ProfileComponent { }
